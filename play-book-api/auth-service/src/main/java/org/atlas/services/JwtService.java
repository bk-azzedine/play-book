package org.atlas.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.atlas.entities.Token;
import org.atlas.entities.User;
import org.atlas.enums.TokenType;

import org.atlas.interfaces.JwtServiceInterface;
import org.atlas.repositories.TokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;


@Service
public class JwtService implements JwtServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    private final TokenRepository tokenRepository;

    @Value("${jwt.secret-key}")
    private String secret;

    @Value("${jwt.expiration-time}")
    private long expirationTime;

    // Access token expiration in milliseconds (10 hours)
    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60 * 10;

    // Refresh token expiration in milliseconds (10 days)
    private static final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 10;

    @Autowired
    public JwtService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Override
    public Mono<String> extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public <T> Mono<T> extractClaim(String token, Function<Claims, T> claimsResolver) {
        return getAllClaimsFromToken(token)
                .map(claimsResolver);
    }

    @Override
    public Mono<Claims> getAllClaimsFromToken(String token) {
        return Mono.fromCallable(() -> Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload());
    }

    @Override
    public Mono<Boolean> validateToken(String token, UserDetails userDetails) {
        return extractUsername(token)
                .flatMap(username -> {
                    if (!username.equals(userDetails.getUsername())) {
                        logger.warn("Token validation failed: username mismatch");
                        return Mono.just(false);
                    }
                    return isTokenExpired(token).flatMap(expired -> {
                        if (expired) {
                            logger.warn("Token validation failed: token expired");
                            return Mono.just(false);
                        }
                        // Check if token is in database and valid
                        return getTokenByFingerprint(calculateFingerprint(token))
                                .flatMap(tokenEntity -> {
                                    if (!tokenEntity.is_valid()) {
                                        logger.warn("Token validation failed: token marked as invalid in database");
                                        return Mono.just(false);
                                    }
                                    return Mono.just(true);
                                })
                                .defaultIfEmpty(false);
                    });
                })
                .onErrorResume(e -> {
                    logger.error("Token validation error: {}", e.getMessage());
                    return Mono.just(false);
                });
    }

    @Override
    public Mono<Boolean> isTokenExpired(String token) {
        return extractExpiration(token)
                .map(expiration -> expiration.before(new Date()))
                .onErrorReturn(true);
    }

    @Override
    public Mono<Date> extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @Override
    public Mono<HashMap<String, String>> generateTokens(Mono<HashMap<String, List<Object>>> claims, User user) {
        return generateTokensInternal(claims, user);
    }

    @Override
    public Mono<HashMap<String, String>> generateTokens(User user) {
        return generateTokensInternal(Mono.just(new HashMap<>()), user);
    }

    private Mono<HashMap<String, String>> generateTokensInternal(Mono<HashMap<String, List<Object>>> claims, User user) {
        HashMap<String, String> tokens = new HashMap<>();
        return createAccessToken(claims, user)
                .flatMap(accessToken -> {
                    tokens.put("access", accessToken.getToken());
                    return createRefreshToken(user, null)
                            .map(refreshToken -> {
                                tokens.put("refresh", refreshToken.getToken());
                                return tokens;
                            });
                });
    }

    @Override
    public Mono<Token> createAccessToken(Mono<HashMap<String, List<Object>>> claims, User user) {
        return claims.flatMap(claimsMap -> {
            String jti = generateJti();
            String tokenString = buildToken(
                    user,
                    claimsMap,
                    ACCESS_TOKEN_EXPIRATION,
                    true, // Include activation status and claims
                    jti
            );

            String fingerprint = calculateFingerprint(tokenString);

            Token token = Token.builder()
                    .userId(user.getUserId())
                    .tokenType(TokenType.ACCESS_TOKEN.toString())
                    .token(tokenString)
                    .tokenFingerprint(fingerprint)
                    .jti(jti)
                    .expires(LocalDateTime.now().plusHours(10))
                    .is_valid(true)
                    .build();

            return tokenRepository.save(token);
        });
    }

    @Override
    public Mono<Token> createRefreshToken(User user) {
        return createRefreshToken(user, null);
    }

    /**
     * Creates a refresh token with optional reference to previous token for rotation
     * 
     * @param user The user for whom to create the token
     * @param previousTokenId The ID of the previous token (for token rotation)
     * @return The created token
     */
    public Mono<Token> createRefreshToken(User user, UUID previousTokenId) {
        String jti = generateJti();
        String refresh = buildToken(
                user,
                new HashMap<>(),
                REFRESH_TOKEN_EXPIRATION,
                false, // No activation status or claims needed
                jti
        );

        String fingerprint = calculateFingerprint(refresh);

        return tokenRepository.save(Token.builder()
                .userId(user.getUserId())
                .token(refresh)
                .tokenFingerprint(fingerprint)
                .jti(jti)
                .previousTokenId(previousTokenId)
                .tokenType(TokenType.REFRESH_TOKEN.toString())
                .expires(LocalDateTime.now().plusDays(10))
                .is_valid(true)
                .build());
    }

    private String buildToken(User user, HashMap<String, List<Object>> claimsMap,
                              long expirationMillis, boolean includeExtraClaims, String jti) {
        JwtBuilder builder = Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
                .id(jti) // Add JTI claim
                .expiration(new Date(System.currentTimeMillis() + expirationMillis));

        if (includeExtraClaims) {
            builder.claim("activated", user.isActivated())
                    .claims(convertClaimsForJwt(claimsMap));
        }

        return builder.signWith(getSignInKey())
                .compact();
    }

    private Map<String, Object> convertClaimsForJwt(HashMap<String, List<Object>> claims) {
        return new HashMap<>(claims);
    }

    @Override
    public SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public Mono<Token> getToken(String token) {
        String fingerprint = calculateFingerprint(token);
        return getTokenByFingerprint(fingerprint);
    }

    /**
     * Retrieves a token by its fingerprint
     * 
     * @param fingerprint The token fingerprint
     * @return The token entity
     */
    private Mono<Token> getTokenByFingerprint(String fingerprint) {
        return tokenRepository.findByTokenFingerprint(fingerprint);
    }

    @Override
    public Mono<String> generateAccess(HashMap<String, List<Object>> claims, User user) {
        return createAccessToken(Mono.just(claims), user).map(Token::getToken);
    }

    /**
     * Generates a unique JWT ID
     * 
     * @return A unique JWT ID
     */
    private String generateJti() {
        return UUID.randomUUID().toString();
    }

    /**
     * Calculates a fingerprint (hash) of the token for secure storage
     * 
     * @param token The token to hash
     * @return The token fingerprint
     */
    private String calculateFingerprint(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();

            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("Error calculating token fingerprint", e);
            // Fallback to a less secure but still usable fingerprint
            return Base64.getEncoder().encodeToString(token.getBytes(StandardCharsets.UTF_8));
        }
    }

    /**
     * Rotates a refresh token by invalidating the old one and creating a new one
     * 
     * @param oldToken The old refresh token
     * @param user The user for whom to rotate the token
     * @return The new refresh token
     */
    public Mono<Token> rotateRefreshToken(Token oldToken, User user) {
        // Mark the old token as invalid
        oldToken.set_valid(false);

        return tokenRepository.save(oldToken)
                .flatMap(savedOldToken -> {
                    // Create a new refresh token with reference to the old one
                    return createRefreshToken(user, savedOldToken.getTokenId());
                });
    }

    /**
     * Refreshes an access token using a refresh token
     * 
     * @param refreshToken The refresh token
     * @param user The user for whom to refresh the token
     * @param claims The claims to include in the new access token
     * @return A map containing the new access token and optionally a new refresh token
     */
    public Mono<HashMap<String, String>> refreshAccessToken(String refreshToken, User user, HashMap<String, List<Object>> claims) {
        return getToken(refreshToken)
                .flatMap(tokenEntity -> {
                    if (!tokenEntity.is_valid() || 
                        tokenEntity.getExpires().isBefore(LocalDateTime.now()) ||
                        !TokenType.REFRESH_TOKEN.toString().equals(tokenEntity.getTokenType())) {
                        return Mono.error(new IllegalArgumentException("Invalid refresh token"));
                    }

                    HashMap<String, String> tokens = new HashMap<>();

                    // Rotate refresh token
                    return rotateRefreshToken(tokenEntity, user)
                            .flatMap(newRefreshToken -> {
                                tokens.put("refresh", newRefreshToken.getToken());

                                // Create new access token
                                return createAccessToken(Mono.just(claims), user)
                                        .map(accessToken -> {
                                            tokens.put("access", accessToken.getToken());
                                            return tokens;
                                        });
                            });
                });
    }
}

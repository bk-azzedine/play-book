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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;


@Service
public class JwtService implements JwtServiceInterface {

    private final TokenRepository tokenRepository;

    @Value("${jwt.secret-key}")
    private String secret;
    @Value("${jwt.expiration-time}")
    private long expirationTime;
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
                        return Mono.just(false);
                    }
                    return isTokenExpired(token).map(expired -> !expired);
                })
                .onErrorReturn(false);
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
                    return createRefreshToken(user)
                            .map(refreshToken -> {
                                tokens.put("refresh", refreshToken.getToken());
                                return tokens;
                            });
                });
    }

    @Override
    public Mono<Token> createAccessToken(Mono<HashMap<String, List<Object>>> claims, User user) {
        return claims.flatMap(claimsMap -> {
            String tokenString = buildToken(
                    user,
                    claimsMap,
                    1000 * 60 * 60 * 10, // 10 hours
                    true // Include activation status and claims
            );

            Token token = Token.builder()
                    .userId(user.getUser_id())
                    .tokenType(TokenType.ACCESS_TOKEN.toString())
                    .token(tokenString)
                    .expires(LocalDateTime.now().plusHours(10))
                    .is_valid(true)
                    .build();

            return tokenRepository.save(token);
        });
    }

    @Override
    public Mono<Token> createRefreshToken(User user) {
        String refresh = buildToken(
                user,
                new HashMap<>(),
                1000 * 60 * 60 * 24 * 10, // 10 days
                false // No activation status or claims needed
        );
        return tokenRepository.save(Token.builder()
                        .userId(user.getUser_id())
                        .token(refresh)
                        .tokenType(TokenType.REFRESH_TOKEN.toString())
                        .expires(LocalDateTime.now().plusDays(10))
                        .is_valid(true)
                .build());
    }

    private String buildToken(User user, HashMap<String, List<Object>> claimsMap,
                              long expirationMillis, boolean includeExtraClaims) {
        JwtBuilder builder = Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(new Date())
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
        return tokenRepository.findByToken(token);
    }

    @Override
    public Mono<String> generateAccess(HashMap<String, List<Object>> claims, User user) {
        return createAccessToken(Mono.just(claims), user).map(Token::getToken);
    }


}
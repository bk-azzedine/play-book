package org.atlas.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.atlas.entities.User;
import org.atlas.interfaces.JwtServiceInterface;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService implements JwtServiceInterface {

    @Value("${jwt.secret-key}")
    private String secret;
    @Value("${jwt.expiration-time}")
    private long expirationTime;

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
    public Mono<String> generateToken(Mono<HashMap<String, List<Object>>> claims, User user) {
        return createToken(claims, user);
    }

    @Override
    public Mono<String> generateToken(User user) {
        return createToken(Mono.just(new HashMap<>()), user);
    }


    @Override
    public Mono<String> createToken(Mono<HashMap<String, List<Object>>> claims, User user) {
        return claims.flatMap(claimsMap -> {
            String token = Jwts.builder()
                    .claim("activated", user.isActivated())
                    .claims(convertClaimsForJwt(claimsMap))
                    .subject(user.getEmail())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                    .signWith(getSignInKey())
                    .compact();

            return Mono.just(token);
        });
    }
    private Map<String, Object> convertClaimsForJwt(HashMap<String, List<Object>> claims) {
        return new HashMap<>(claims);
    }

    @Override
    public SecretKey getSignInKey() {
        // This remains synchronous as it's a simple operation and used by other methods
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
package org.atlas.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.atlas.interfaces.JwtServiceInterface;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
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
                .map(username -> username.equals(userDetails.getUsername()) && !isTokenExpired(token))
                .onErrorReturn(false);
    }

    @Override
    public Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).block().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    @Override
    public Mono<Date> extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @Override
    public Mono<String> generateToken(HashMap<String, Object> claims, UserDetails userDetails) {
        return createToken(claims, userDetails.getUsername());
    }

    @Override
    public Mono<String> generateToken(HashMap<String, Object> claims, String username) {
        return createToken(claims, username);
    }

    @Override
    public Mono<String> createToken(Map<String, Object> claims, String subject) {
        return Mono.fromCallable(() -> Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignInKey())
                .compact());
    }

    @Override
    public SecretKey getSignInKey() {
        // This remains synchronous as it's a simple operation and used by other methods
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
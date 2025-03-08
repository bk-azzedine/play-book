package org.atlas.interfaces;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public interface JwtServiceInterface {
    Mono<String> extractUsername(String token);

    <T> Mono<T> extractClaim(String token, Function<Claims, T> claimsResolver);


    Mono<Claims> getAllClaimsFromToken(String token);

    Mono<Boolean> validateToken(String token, UserDetails userDetails);

    Boolean isTokenExpired(String token);

    Mono<Date> extractExpiration(String token);

    Mono<String> generateToken(HashMap<String, Object> claims, UserDetails userDetails);


    Mono<String> generateToken(HashMap<String, Object> claims, String username);

    Mono<String> createToken(Map<String, Object> claims, String subject);

    SecretKey getSignInKey();
}

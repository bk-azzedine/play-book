package org.atlas.interfaces;

import io.jsonwebtoken.Claims;
import org.atlas.entities.User;
import org.springframework.security.core.userdetails.UserDetails;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.function.Function;

public interface JwtServiceInterface {
    Mono<String> extractUsername(String token);

    <T> Mono<T> extractClaim(String token, Function<Claims, T> claimsResolver);


    Mono<Claims> getAllClaimsFromToken(String token);

    Mono<Boolean> validateToken(String token, UserDetails userDetails);

    Mono<Boolean> isTokenExpired(String token);

    Mono<Date> extractExpiration(String token);

    Mono<String> generateToken(Mono<HashMap<String, List<Object>>> claims, User user);

    Mono<String> generateToken(User user);


    Mono<String> createToken(Mono<HashMap<String, List<Object>>> claims, User user);

    SecretKey getSignInKey();
}

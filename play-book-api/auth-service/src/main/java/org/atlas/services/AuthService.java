package org.atlas.services;


import org.atlas.entities.User;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.interfaces.JwtServiceInterface;
import org.atlas.requests.SignInRequest;
import org.atlas.responses.SignInResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

import static org.atlas.exceptions.Exceptions.EXCEPTION_02;
import static org.atlas.exceptions.Exceptions.EXCEPTION_04;

@Service
public class AuthService  implements AuthServiceInterface {

    private final CustomUserServiceDetails customUserServiceDetails;
    private final JwtServiceInterface jwtService;
    private final ReactiveAuthenticationManager authenticationManager;
    private final WebClient organizationWebClient;

    final Logger logger =
            LoggerFactory.getLogger(AuthService.class);

    @Autowired
    public AuthService(
            CustomUserServiceDetails customUserServiceDetails,
            JwtServiceInterface jwtService,
            ReactiveAuthenticationManager authenticationManager,
            @Qualifier("organizationWebClient") WebClient organizationWebClient) {

        this.customUserServiceDetails = customUserServiceDetails;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.organizationWebClient = organizationWebClient;
    }



    @Override
    public Mono<HashMap<String, String>>  generateToken(User user) {
        return jwtService.generateTokens(user).flatMap(Mono::just);
    }

    @Override
    public Mono<SignInResponse> authenticate(SignInRequest request) {
        return authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.password()
                        )
                )
                .onErrorMap(BadCredentialsException.class, ex -> {

                    return new Exception(ExceptionHandler.processEnum(EXCEPTION_04));
                })
                .flatMap(auth -> {
                    var user = (User) auth.getPrincipal();
                    var claims = this.getUserClaims(user.getUser_id());

                    return jwtService.generateTokens(claims, user).map(
                            res ->
                                    new SignInResponse(res.get("access"),res.get("refresh") )
                    );

                });
    }

    @Override
    public Mono<Boolean> validateToken(String token) {
        logger.info("Starting token validation for token: {}", token);

        // First check if token exists in the database
        return jwtService.getToken(token)
                .doOnSubscribe(subscription -> logger.info("Fetching token from db"))
                .flatMap(tokenEntity -> {
                    // If token exists in DB and is not expired, proceed with JWT validation
                    if (tokenEntity.getExpires().isAfter(LocalDateTime.now()) && tokenEntity.is_valid()) {
                        logger.info("Token found in database and not expired");

                        return jwtService.extractUsername(token)
                                .doOnSubscribe(subscription -> logger.info("Extracting username from token"))
                                .flatMap(username -> {
                                    logger.info("Username extracted: {}", username);
                                    return customUserServiceDetails.findByUsername(username)
                                            .doOnSubscribe(sub -> logger.info("Fetching user details for username: {}", username))
                                            .flatMap(userDetails -> {
                                                logger.info("User details found: {}", userDetails);
                                                return jwtService.validateToken(token, userDetails)
                                                        .doOnSubscribe(sub2 -> logger.info("Validating token with user details"))
                                                        .doOnSuccess(valid -> logger.info("Token validation result: {}", valid));
                                            })
                                            .defaultIfEmpty(false);
                                });
                    } else {
                        logger.info("Token expired or invalid in database");
                        return Mono.just(false);
                    }
                })
                .defaultIfEmpty(false)
                .onErrorResume(error -> {
                    logger.error("Error during token validation: {}", error.getMessage());
                    return Mono.just(false);
                })
                .doOnTerminate(() -> logger.info("Token validation process completed"));
    }

    @Override
    public Mono<HashMap<String, List<Object>>> getUserClaims(UUID userId) {
        logger.info("Fetching claims for user: {}", userId);

        return organizationWebClient.get()
                .uri("/security/claims/{user_id}", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<HashMap<String, List<Object>>>() {})
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof WebClientResponseException))
                .timeout(Duration.ofSeconds(3))
                .doOnError(error -> logger.error("Claims fetch failed: {}", error.getMessage()))
                .onErrorMap(error -> new Exception(ExceptionHandler.processEnum(EXCEPTION_02), error))
                .defaultIfEmpty(new HashMap<>());

    }

    @Override
    public Mono<HashMap<String, List<?>>> getUserClaims(String token) {
        return jwtService.getAllClaimsFromToken(token).map(claim -> {
            HashMap<String, List<?>> claims = new HashMap<>();
            claims.put("email", Collections.singletonList(claim.getSubject()));
            return claims;
        });
    }
    @Override
    public Mono<String> generateAccessFromRefresh(String refreshToken){
        logger.info("Starting generation of access token from refresh token: {}", refreshToken);

        return jwtService.getToken(refreshToken)
                .doOnSubscribe(sub -> logger.info("Fetching token entity from database"))
                .flatMap(token -> {
                    logger.info("Token entity retrieved: {}", token);
                    return jwtService.extractUsername(refreshToken);
                })
                .doOnNext(username -> logger.info("Extracted username: {}", username))
                .flatMap(customUserServiceDetails::findUserByEmail)
                .doOnNext(user -> logger.info("User found by email: {}", user))
                .flatMap(user -> getUserClaims(user.getUser_id())
                        .doOnNext(claims -> logger.info("User claims retrieved: {}", claims))
                        .flatMap(claims -> jwtService.generateAccess(claims, user))
                        .doOnSuccess(accessToken -> logger.info("Access token generated successfully")))
                .onErrorResume(error -> {
                    logger.error("Error during access token generation from refresh: {}", error.getMessage());
                    return Mono.error(error);
                })
                .doOnTerminate(() -> logger.info("Access token generation process completed"));
    }



}
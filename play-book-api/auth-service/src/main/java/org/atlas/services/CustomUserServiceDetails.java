package org.atlas.services;

import org.atlas.entities.User;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.UserServiceInterface;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;


import java.util.UUID;

import static org.atlas.exceptions.Exceptions.EXCEPTION_03;

@Service
public class CustomUserServiceDetails implements ReactiveUserDetailsService, UserServiceInterface {

    private final WebClient userClient;
    final Logger logger =
            LoggerFactory.getLogger(CustomUserServiceDetails.class);

    @Autowired
    public CustomUserServiceDetails(@Qualifier("userWebClient") WebClient userClient) {
        this.userClient = userClient;
    }

    @Override
    public Mono<User> findUserByEmail(String email) {
        logger.info("Sending user lookup request to: {}/{}", userClient.toString(), email);

        return userClient.get()
                .uri("/security/" + email)
                .retrieve()
                .bodyToMono(User.class)
                .onErrorResume(WebClientResponseException.NotFound.class, ex -> {
                    logger.error("User not found with email: {}", email);
                    return Mono.empty();
                })
                .doOnError(throwable -> {
                    logger.error("Error finding user by email: {}", email, throwable);
                });
    }
    @Override
    public Mono<Boolean> validateUser(UUID userId) {
        logger.info("Validating user: {}/{}", userClient.toString(), userId);
        return userClient.post()
                .uri("/validate/user/{userId}", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.NotFound.class, ex -> {
                    logger.error("User not found with id: {}", userId);
                    return Mono.empty();
                })
                .doOnError(throwable -> {
                    logger.error("Error finding user by id: {}", userId, throwable);
                });
    }

    @Override
    public Mono<UserDetails> findByUsername(String email) {
        return findUserByEmail(email)
                .cast(UserDetails.class)
                .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03))));
    }
}

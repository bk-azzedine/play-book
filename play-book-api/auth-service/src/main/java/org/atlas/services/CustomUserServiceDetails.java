package org.atlas.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.UserServiceInterface;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.ArrayList;


import static org.atlas.exceptions.Exceptions.EXCEPTION_02;
import static org.atlas.exceptions.Exceptions.EXCEPTION_03;

@Service
public class CustomUserServiceDetails implements ReactiveUserDetailsService, UserServiceInterface {

    private final WebClient userClient;
    final Logger logger =
            LoggerFactory.getLogger(CustomUserServiceDetails.class);

    @Autowired
    public CustomUserServiceDetails(WebClient userClient) {
        this.userClient = userClient;
    }


    @Override
    public Mono<UserDetails> findUserByEmail(String email) {
        logger.info("Sending user lookup request to: {}{}", userClient.toString(), email);

        return userClient.get()
                .uri(email)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(jsonNode -> {
                    String username = jsonNode.get("email").asText();
                    String password = jsonNode.get("password").asText();

                    return User.withUsername(username)
                            .password(password)
                            .authorities(new ArrayList<>())
                            .build();
                })
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof WebClientResponseException))
                .timeout(Duration.ofSeconds(3))
                .doOnError(error -> logger.error("User lookup failed: {}", error.getMessage()))
                .onErrorMap(error -> new Exception(ExceptionHandler.processEnum(EXCEPTION_02)));
    }

    @Override
    public Mono<UserDetails> findByUsername(String email) {
        return findUserByEmail(email)
                .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03))));
    }
}

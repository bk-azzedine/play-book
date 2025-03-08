package org.atlas.services;


import lombok.extern.slf4j.Slf4j;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.AuthServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.atlas.exceptions.Exceptions.EXCEPTION_02;

@Service
@Slf4j
public class AuthService implements AuthServiceInterface {
    private final WebClient authWebClient;
    final Logger logger =
            LoggerFactory.getLogger(AuthService.class);

    public AuthService(WebClient authWebClient) {
        this.authWebClient = authWebClient;
    }

    @Override
    public Mono<String> generateToken(HashMap<String, Object> claims, String username) {
        String uri = "/generate/token";
        log.info("Sending token generation request to: {}{}", authWebClient.toString(), uri);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("claims", claims);
        requestBody.put("username", username);

        return authWebClient.post()
                .uri(uri)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .filter(token -> token != null && !token.isEmpty()) // Ensure non-empty token
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof WebClientResponseException))
                .timeout(Duration.ofSeconds(3))
                .doOnError(error -> log.error("Token generation failed: {}", error.getMessage()))
                .onErrorMap(error -> {
                    throw new Exception(ExceptionHandler.processEnum(EXCEPTION_02));
                });
    }





}

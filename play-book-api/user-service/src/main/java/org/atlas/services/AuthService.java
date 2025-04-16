package org.atlas.services;

import lombok.extern.slf4j.Slf4j;
import org.atlas.dtos.UserDto;
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
import java.util.UUID;

import static org.atlas.exceptions.Exceptions.EXCEPTION_02;

@Service
@Slf4j
public class AuthService implements AuthServiceInterface {
    private final WebClient authWebClient;
    final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public AuthService(WebClient authWebClient) {
        this.authWebClient = authWebClient;
    }

    @Override
    public Mono<String> generateToken(UserDto user) {
        String uri = "/generate/token";
        log.info("Initiating token generation for user: {}", user.getEmail());

        return authWebClient.post()
                .uri(uri)
                .bodyValue(user)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSubscribe(subscription -> log.info("Sending POST request to {}{}", authWebClient.toString(), uri))
                .doOnNext(token -> log.info("Received token successfully"))
                .doOnError(error -> log.error("Token generation failed: {}", error.getMessage(), error))
                .filter(token -> {
                    boolean isValid = token != null && !token.isEmpty();
                    if (!isValid) {
                        log.warn("Received empty or null token");
                    }
                    return isValid;
                })
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> {
                            log.warn("Retrying after error: {}", throwable.getMessage());
                            return throwable instanceof WebClientResponseException;
                        }))
                .timeout(Duration.ofSeconds(3))
                .onErrorMap(error -> {
                    log.error("Final error after retries in token generation: {}", error.getMessage());
                    throw new Exception(ExceptionHandler.processEnum(EXCEPTION_02));
                });
    }

    @Override
    public Mono<String> generateActivationCode(UUID userId) {
        String baseUri = "/generate/code";
        log.info("Initiating activation code generation for userId: {}", userId);

        return authWebClient.get()
                .uri(uriBuilder -> uriBuilder.path(baseUri + "/{userId}").build(userId))
                .retrieve()
                .bodyToMono(String.class)
                .doOnSubscribe(subscription ->
                        log.info("Sending GET request to {}{}/{}", authWebClient.toString(), baseUri, userId))
                .doOnNext(code -> log.info("Received activation code successfully"))
                .doOnError(error -> log.error("Activation code generation failed: {}", error.getMessage(), error))
                .filter(code -> {
                    boolean isValid = code != null && !code.isEmpty();
                    if (!isValid) {
                        log.warn("Received empty or null activation code");
                    }
                    return isValid;
                })
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> {
                            log.warn("Retrying activation code request after error: {}", throwable.getMessage());
                            return throwable instanceof WebClientResponseException;
                        }))
                .timeout(Duration.ofSeconds(3))
                .onErrorMap(error -> {
                    log.error("Final error after retries in activation code generation: {}", error.getMessage());
                    throw new Exception(ExceptionHandler.processEnum(EXCEPTION_02));
                });
    }
}

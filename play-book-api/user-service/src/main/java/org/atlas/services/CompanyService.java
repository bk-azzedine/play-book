package org.atlas.services;

import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.CompanyServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.UUID;


import static org.atlas.exceptions.Exceptions.EXCEPTION_04;

@Service
public class CompanyService implements CompanyServiceInterface {
    final Logger logger = LoggerFactory.getLogger(CompanyService.class);
    private final WebClient orgClient;

    public CompanyService(@Qualifier("orgWebClient") WebClient orgClient) {
        this.orgClient = orgClient;
    }

    @Override
    public Mono<String> registerWithCompany(String inviteCode, String userId) {
        logger.info("Registering user {} with company using invite code: {}", userId, inviteCode);

        UUID inviteId;
        UUID userUuid;

        try {
            inviteId = UUID.fromString(inviteCode);
            userUuid = UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid UUID format - inviteCode: {}, userId: {} - {}", inviteCode, userId, e.getMessage());
            return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_04)));
        }

        String uri = "team/add-user/{inviteId}/{userId}";
        logger.info("Calling add user to team endpoint for inviteId: {}, userId: {}", inviteId, userUuid);

        return orgClient.post()
                .uri(uri, inviteId, userUuid)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSubscribe(subscription -> logger.info("Sending POST request to {}{}", orgClient.toString(), uri))
                .doOnNext(result -> logger.info("Successfully registered user {} with company: {}", userId, result))
                .doOnError(error -> logger.error("Failed to register user {} with company: {}", userId, error.getMessage(), error))
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> {
                            logger.warn("Retrying user registration after error: {}", throwable.getMessage());
                            return throwable instanceof WebClientResponseException &&
                                    !((WebClientResponseException) throwable).getStatusCode().is4xxClientError();
                        }))
                .timeout(Duration.ofSeconds(10))
                .onErrorMap(error -> {
                    if (error instanceof WebClientResponseException webEx) {
                        if (webEx.getStatusCode().is4xxClientError()) {
                            logger.error("Client error registering user: {}", webEx.getMessage());
                            return new Exception(ExceptionHandler.processEnum(EXCEPTION_04));
                        }
                    }
                    logger.error("Final error after retries in user registration: {}", error.getMessage());
                    return new Exception(ExceptionHandler.processEnum(EXCEPTION_04));
                });
    }
    @Override
    public Mono<Boolean> validateInviteCode(String inviteCodeString) {
        UUID inviteCode;
        try {
            inviteCode = UUID.fromString(inviteCodeString);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid invite code UUID format: {} - {}", inviteCodeString, e.getMessage());
            return Mono.just(false);
        }

        String uri = "/company/invite-code/validate/{inviteCode}";
        logger.info("Initiating invite code validation for: {}", inviteCode);

        return orgClient.get()
                .uri(uri, inviteCode)
                .retrieve()
                .bodyToMono(Boolean.class)
                .doOnSubscribe(subscription -> logger.info("Sending GET request to {}{}", orgClient.toString(), uri))
                .doOnNext(isValid -> logger.info("Invite code validation result: {}", isValid))
                .doOnError(error -> logger.error("Invite code validation failed: {}", error.getMessage(), error))
                .defaultIfEmpty(false)
                .filter(result -> {
                    boolean isValid = result != null && result;
                    if (!isValid) {
                        logger.warn("Invite code validation returned false or null");
                    }
                    return true; // Always pass through, we handle the logic in onErrorMap
                })
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> {
                            logger.warn("Retrying invite validation after error: {}", throwable.getMessage());
                            return throwable instanceof WebClientResponseException &&
                                    !((WebClientResponseException) throwable).getStatusCode().equals(HttpStatus.NOT_FOUND);
                        }))
                .timeout(Duration.ofSeconds(3))
                .onErrorMap(error -> {
                    if (error instanceof WebClientResponseException webEx) {
                        if (webEx.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                            logger.info("Invite code not found, returning false");
                            return new Exception(ExceptionHandler.processEnum(EXCEPTION_04));

                        }
                    }
                    logger.error("Final error after retries in invite validation: {}", error.getMessage());
                    return new Exception(ExceptionHandler.processEnum(EXCEPTION_04));
                });
    }
}

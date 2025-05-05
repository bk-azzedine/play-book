package org.atlas.services;

import org.atlas.interfaces.UserServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;
@Service
public class UserService implements UserServiceInterface {
    private final WebClient userClient;
    final Logger logger =
            LoggerFactory.getLogger(UserService.class);
    @Autowired
    public UserService(@Qualifier("userWebClient") WebClient userClient) {
        this.userClient = userClient;
    }

    @Override
    public Mono<UUID> getUserByEmail(String email) {
        logger.info("Sending user lookup request to: {}/{}", userClient.toString(), email);
        return userClient.get()
                .uri("/security/" + email)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(response -> UUID.fromString((String) response.get("userId")))
                .onErrorResume(WebClientResponseException.NotFound.class, ex -> {
                    logger.error("User not found with email: {}", email);
                    return Mono.empty();
                })
                .onErrorResume(throwable -> {
                    logger.error("Error finding user by email: {}", email, throwable);
                    return Mono.empty();
                });
    }

}

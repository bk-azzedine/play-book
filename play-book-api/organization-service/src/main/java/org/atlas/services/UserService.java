package org.atlas.services;

import org.atlas.dtos.UserDto;
import org.atlas.interfaces.UserServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
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
    @Override
    public Flux<UserDto> getOrgMembers(List<UUID> ids) {
        logger.info("Sending users lookup request to user service for {} user IDs", ids.size());
        logger.debug("User IDs being requested: {}", ids);
        return userClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/org/members")
                        .queryParam("ids", ids)
                        .build())
                .retrieve()
                .bodyToFlux(UserDto.class)
                .doOnNext(user -> logger.info("Received user from service: ID={}, Name={}", user.getUserId(), user.getFirstName()))
                .doOnComplete(() -> logger.info("Completed fetching users from user service"))
                .onErrorResume(WebClientResponseException.NotFound.class, ex -> {
                    logger.error("Users not found for IDs: {}", ids);
                    return Flux.empty();
                })
                .onErrorResume(throwable -> {
                    logger.error("Error fetching users for IDs: {}", ids, throwable);
                    return Flux.empty();
                });
    }

}

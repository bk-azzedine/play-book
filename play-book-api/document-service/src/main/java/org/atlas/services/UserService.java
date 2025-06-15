package org.atlas.services;

import org.atlas.dtos.UserDto;
import org.atlas.interfaces.UserServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;
@Service
public class UserService implements UserServiceInterface {
    private final WebClient userClient;
    final Logger logger =
            LoggerFactory.getLogger(UserService.class);
    @Autowired
    public UserService(WebClient userClient) {
        this.userClient = userClient;
    }

    @Override
    public Flux<UserDto> getDocAuthors(List<UUID> ids) {
        logger.info("Sending user lookup request to: {}/{}", userClient.toString(), ids);
        return userClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/doc/authors")
                        .queryParam("ids", ids)
                        .build())
                .retrieve()
                .bodyToFlux(UserDto.class)
                .onErrorResume(WebClientResponseException.NotFound.class, ex -> {
                    logger.error("Authors not found for email: {}", ids);
                    return Flux.empty();
                })
                .onErrorResume(throwable -> {
                    logger.error("Error fetching document authors for email: {}", ids, throwable);
                    return Flux.empty();
                });
    }
}

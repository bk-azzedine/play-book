package org.atlas.services;

import lombok.extern.slf4j.Slf4j;
import org.atlas.filters.SecurityFilter;
import org.atlas.interfaces.AuthServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.concurrent.TimeoutException;
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
    public Mono<Boolean> validateToken(String token) {
        String uri = "/validate/token";
        log.info("Sending token validation request to: {}{}", authWebClient.toString(), uri);

        return authWebClient.post()
                .uri(uri)
                .bodyValue(token)
                .retrieve()
                .bodyToMono(Boolean.class)
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof WebClientResponseException))
                .timeout(Duration.ofSeconds(5))
                .doOnError(error -> log.error("Token validation failed: {}", error.getMessage()))
                .onErrorResume(error -> {
                    if (error instanceof TimeoutException) {
                        log.error("Token validation timed out");
                        return Mono.just(false);
                    }
                    return Mono.just(false);
                });
    }

    @Override
    public String getAuthHeader(ServerHttpRequest request) {
        final String authHeader = request.getHeaders().getFirst("Authorization").substring(7);
        logger.debug("Retrieved auth header, length: {}", authHeader.length());
        return authHeader;
    }

    @Override
    public boolean isAuthMissing(ServerHttpRequest request) {
        boolean missing = !request.getHeaders().containsKey("Authorization");
        if (missing) {
            logger.debug("Authorization header is missing");
        }
        return missing;
    }


}

package org.atlas.interfaces;

import org.springframework.http.server.reactive.ServerHttpRequest;
import reactor.core.publisher.Mono;

public interface AuthServiceInterface {

    /**
     * this method calls the validate token api from the
     * auth-service
     * @param token  security token
     * @return boolean
     */
    Mono<Boolean> validateToken(String token);


    String getAuthHeader(ServerHttpRequest request);

    boolean isAuthMissing(ServerHttpRequest request);
}

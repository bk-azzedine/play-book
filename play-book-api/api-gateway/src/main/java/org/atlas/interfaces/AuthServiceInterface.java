package org.atlas.interfaces;

import org.springframework.http.server.reactive.ServerHttpRequest;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;

public interface AuthServiceInterface {

    /**
     * this method calls the validate token api from the
     * auth-service
     * @param token  security token
     * @return boolean
     */
    Mono<Boolean> validateToken(String token);


    String getAuthHeader(ServerHttpRequest request);

    Mono<HashMap<String, List<Object>>> getClaims(String  token);

    boolean isAuthMissing(ServerHttpRequest request);
}

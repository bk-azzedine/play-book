package org.atlas.interfaces;

import org.atlas.requests.SignInRequest;
import org.atlas.responses.SignInResponse;
import reactor.core.publisher.Mono;

import java.util.Map;

public interface AuthServiceInterface {
    Mono<String> generateToken(Map<String,Object> claims);

    Mono<SignInResponse> authenticate(SignInRequest request);

    Mono<Boolean> validateToken(String token);
}

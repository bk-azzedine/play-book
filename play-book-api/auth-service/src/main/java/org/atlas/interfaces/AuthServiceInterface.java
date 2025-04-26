package org.atlas.interfaces;

import org.atlas.entities.User;
import org.atlas.requests.SignInRequest;
import org.atlas.responses.SignInResponse;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AuthServiceInterface {
    Mono<HashMap<String, String>> generateToken(User user);

    Mono<SignInResponse> authenticate(SignInRequest request);

    Mono<Boolean> validateToken(String token);

    Mono<HashMap<String, List<Object>>> getUserClaims(UUID userId);

    Mono<HashMap<String, List<?>>> getUserClaims(String token);

  Mono<String> generateAccessFromRefresh(String refreshToken);
}

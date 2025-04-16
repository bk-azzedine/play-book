package org.atlas.interfaces;

import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.UUID;

public interface ActivationServiceInterface {
    Mono<String> generateActivationCode(UUID userID);

    Mono<HashMap<String, Object>> validateAccount(String code, String userId);

    Mono<String> resendCode(String email);
}

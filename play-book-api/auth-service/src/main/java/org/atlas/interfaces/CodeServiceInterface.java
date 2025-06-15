package org.atlas.interfaces;

import brave.propagation.tracecontext.internal.collect.UnsafeArrayMap;
import org.atlas.requests.ResetPasswordRequest;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.UUID;

public interface CodeServiceInterface {
    Mono<String> generateActivationCode(UUID userID);

    Mono<HashMap<String, Object>> validateAccount(String code, String userId);

    Mono<String> resendCode(String email);


    Mono<String> forgotPassword(String email);

    Mono<String> validateReset(String code);


}

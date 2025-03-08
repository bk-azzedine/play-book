package org.atlas.interfaces;

import org.atlas.entities.User;
import org.atlas.requests.SignUpRequest;
import org.atlas.responses.SignUpResponse;
import reactor.core.publisher.Mono;

public interface UserServiceInterface {
    Mono<User> saveUser(SignUpRequest signUpRequest);

    Mono<SignUpResponse> registerUser(SignUpRequest signUpRequest);

    Mono<User> findUserByEmail(String email);
}

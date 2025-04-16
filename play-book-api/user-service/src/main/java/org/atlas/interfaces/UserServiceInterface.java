package org.atlas.interfaces;

import org.atlas.dtos.UserDto;
import org.atlas.entities.User;
import org.atlas.requests.SignUpRequest;
import org.atlas.responses.SignUpResponse;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface UserServiceInterface {
    Mono<User> saveUser(SignUpRequest signUpRequest);

    Mono<SignUpResponse> registerUser(SignUpRequest signUpRequest);

    Mono<User> findUserByEmail(String email);

    Mono<Boolean> checkIfEmailExists(String email);

    Mono<Boolean> validateUser(UUID userId);
}

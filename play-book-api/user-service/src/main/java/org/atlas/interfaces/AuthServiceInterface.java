package org.atlas.interfaces;

import org.atlas.dtos.UserDto;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.UUID;

public interface AuthServiceInterface {


    Mono<String> generateToken(UserDto user);

    Mono<String> generateActivationCode(UUID userID);
}

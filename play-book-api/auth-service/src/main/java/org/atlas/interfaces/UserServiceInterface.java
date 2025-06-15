package org.atlas.interfaces;

import org.atlas.entities.User;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface UserServiceInterface {



    Mono<User> findUserByEmail(String email);

    Mono<User> findUserById(String email);

    Mono<User> updatePassword(User user);

    Mono<Boolean> validateUser(UUID user);
}

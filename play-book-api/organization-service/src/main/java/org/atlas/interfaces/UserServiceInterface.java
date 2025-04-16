package org.atlas.interfaces;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface UserServiceInterface {
    Mono<UUID> getUserByEmail(String email);
}

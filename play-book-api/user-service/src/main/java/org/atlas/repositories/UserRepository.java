package org.atlas.repositories;

import org.atlas.entities.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface UserRepository extends ReactiveCrudRepository<User, UUID> {
    Mono<Boolean> existsByEmail(String username);

    Mono<User> findUserByEmail(String email);
}

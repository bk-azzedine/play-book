package org.atlas.repositories;

import org.atlas.entities.Token;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;
@Repository
public interface TokenRepository extends ReactiveCrudRepository<Token, UUID> {
    Mono<Token> findByToken(String token);
}

package org.atlas.repositories;


import org.atlas.entities.Codes;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;
@Repository
public interface CodesRepository extends ReactiveCrudRepository<Codes, UUID> {

    Mono<Boolean> existsByCode(String code);

    Mono<Codes> findByCode(String code);
    Mono<Codes> findByCodeAndUserId(String code, UUID userId);

}

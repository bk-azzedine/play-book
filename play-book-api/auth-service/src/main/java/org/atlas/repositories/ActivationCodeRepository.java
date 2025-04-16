package org.atlas.repositories;


import org.atlas.entities.ActivationCode;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;
@Repository
public interface ActivationCodeRepository extends ReactiveCrudRepository<ActivationCode, UUID> {

    Mono<Boolean> existsByCode(String code);

    Mono<ActivationCode> findByCodeAndUserId(String code, UUID userId);

}

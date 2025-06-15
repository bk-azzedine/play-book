package org.atlas.repositories;

import org.atlas.entities.Space;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;
@Repository
public interface SpaceRepository extends ReactiveCrudRepository<Space, UUID> {

    Flux<Space> findAllByTeamId(UUID team);
}

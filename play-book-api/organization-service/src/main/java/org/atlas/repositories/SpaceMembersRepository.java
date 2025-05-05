package org.atlas.repositories;

import org.atlas.entities.SpaceMembers;


import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;
@Repository
public interface SpaceMembersRepository extends ReactiveCrudRepository<SpaceMembers, UUID> {
    Flux<SpaceMembers> findAllByUserId(UUID userId);
    Flux<SpaceMembers> findAllBySpaceId(UUID space);
}

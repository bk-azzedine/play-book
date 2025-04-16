package org.atlas.repositories;

import org.atlas.entities.Organization;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface OrganizationRepository extends ReactiveCrudRepository<Organization, UUID> {
    Flux<Organization> findAllByOwnerId(UUID userId);
}

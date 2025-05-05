package org.atlas.repositories;

import org.atlas.entities.Organization;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface OrganizationRepository extends ReactiveCrudRepository<Organization, UUID> {
    Flux<Organization> findAllByOwnerId(UUID userId);

    @Query("SELECT DISTINCT o.* FROM organizations o " +
            "LEFT JOIN teams t ON o.organization_id = t.organization_id " +
            "LEFT JOIN team_members tm ON t.team_id = tm.team_id " +
            "WHERE o.owner_id = :userId OR tm.user_id = :userId")
    Flux<Organization> findAllRelatedToUser(UUID userId);
}

package org.atlas.repositories;

import org.atlas.entities.Team;
import org.atlas.entities.TeamMembers;
import org.atlas.responses.Claims;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;
@Repository
public interface TeamMembersRepository extends ReactiveCrudRepository<TeamMembers, UUID> {
    Flux<TeamMembers> findAllByUserId(UUID userId);
}

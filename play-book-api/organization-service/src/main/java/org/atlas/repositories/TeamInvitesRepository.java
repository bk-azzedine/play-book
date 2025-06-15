package org.atlas.repositories;

import org.atlas.entities.TeamInvites;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface TeamInvitesRepository extends ReactiveCrudRepository<TeamInvites, UUID> {
}

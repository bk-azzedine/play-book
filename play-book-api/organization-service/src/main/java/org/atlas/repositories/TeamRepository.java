package org.atlas.repositories;

import org.atlas.entities.Team;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TeamRepository extends ReactiveCrudRepository<Team, UUID> {
}

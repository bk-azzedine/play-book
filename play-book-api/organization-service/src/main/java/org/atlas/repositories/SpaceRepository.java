package org.atlas.repositories;

import org.atlas.entities.Space;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface SpaceRepository extends CrudRepository<Space, UUID> {
}

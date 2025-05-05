package org.atlas.interfaces;

import org.atlas.dtos.SpaceDto;
import org.atlas.entities.Space;
import org.atlas.requests.SpaceRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SpaceServiceInterface {
    Mono<Space> createSpace(SpaceRequest spaceRequest);

    Flux<SpaceDto> getSpaces(UUID team);
}

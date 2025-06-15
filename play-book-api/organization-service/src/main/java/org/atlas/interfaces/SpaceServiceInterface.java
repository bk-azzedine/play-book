package org.atlas.interfaces;

import org.atlas.dtos.SpaceDto;
import org.atlas.entities.Space;
import org.atlas.requests.SpaceRequest;
import org.atlas.requests.SpaceUpdateRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface SpaceServiceInterface {
    Mono<SpaceDto> createSpace(SpaceRequest spaceRequest);
    Mono<SpaceDto> updateSpace(SpaceUpdateRequest spaceUpdateRequest);
    Mono<String> deleteSpace(UUID spaceId);
    Flux<SpaceDto> getSpaces(UUID team);
}

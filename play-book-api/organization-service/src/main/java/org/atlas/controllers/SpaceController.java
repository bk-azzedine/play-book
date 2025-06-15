package org.atlas.controllers;

import org.atlas.dtos.SpaceDto;
import org.atlas.entities.Team;
import org.atlas.interfaces.SpaceServiceInterface;
import org.atlas.requests.SpaceRequest;
import org.atlas.requests.SpaceUpdateRequest;
import org.atlas.services.SpaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/org/space")
public class SpaceController {
    private final SpaceServiceInterface spaceService;

    @Autowired
    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @PostMapping
    public Mono<ResponseEntity<SpaceDto>> createSpace(@RequestBody SpaceRequest spaceRequest) {
        return spaceService.createSpace(spaceRequest)
                .map(spaceDto -> {
                    return ResponseEntity.ok().body(spaceDto);
                });
    }
    @PostMapping("/update")
    public Mono<ResponseEntity<SpaceDto>> updateSpace(@RequestBody SpaceUpdateRequest spaceUpdateRequest) {
        return spaceService.updateSpace(spaceUpdateRequest)
                .map(spaceDto -> {
                    return ResponseEntity.ok().body(spaceDto);
                });
    }

    @DeleteMapping("/delete/{spaceId}")
    public Mono<ResponseEntity<String>> deleteSpace(@PathVariable("spaceId") UUID spaceId ) {
        return spaceService.deleteSpace(spaceId)
                .map(res -> {
                    return ResponseEntity.ok().body(res);
                });
    }
}

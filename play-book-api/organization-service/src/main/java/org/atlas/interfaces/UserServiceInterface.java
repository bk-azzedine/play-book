package org.atlas.interfaces;

import org.atlas.dtos.UserDto;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface UserServiceInterface {
    Mono<UUID> getUserByEmail(String email);

    Flux<UserDto> getOrgMembers(List<UUID> ids);
}

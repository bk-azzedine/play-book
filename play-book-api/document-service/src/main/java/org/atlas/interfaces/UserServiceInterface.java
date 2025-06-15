package org.atlas.interfaces;

import org.atlas.dtos.UserDto;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.UUID;

public interface UserServiceInterface {



    Flux<UserDto> getDocAuthors(List<UUID> ids);
}

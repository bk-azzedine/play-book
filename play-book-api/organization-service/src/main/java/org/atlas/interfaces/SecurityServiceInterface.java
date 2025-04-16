package org.atlas.interfaces;

import org.atlas.responses.Claims;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

public interface SecurityServiceInterface {
     Mono<HashMap<String, List<?>>> getClaims(UUID user_id);
}

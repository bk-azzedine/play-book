package org.atlas.interfaces;

import reactor.core.publisher.Mono;

import java.util.HashMap;

public interface AuthServiceInterface {


    Mono<String> generateToken(HashMap<String, Object> claims, String username);
}

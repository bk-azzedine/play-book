package org.atlas.interfaces;

import org.springframework.security.core.userdetails.UserDetails;
import reactor.core.publisher.Mono;

public interface UserServiceInterface {



    Mono<UserDetails> findUserByEmail(String email);
}

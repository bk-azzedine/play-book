package org.atlas.controllers;

import org.atlas.interfaces.SecurityServiceInterface;
import org.atlas.responses.Claims;
import org.atlas.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/org/security")
public class SecurityController {
    private final SecurityServiceInterface securityService;

    @Autowired
    public SecurityController(SecurityService securityService) {
        this.securityService = securityService;
    }

    @GetMapping("/claims/{user_id}")
    public Mono<ResponseEntity<HashMap<String, List<?>>>> claims(@PathVariable("user_id") UUID user_id) {
        return securityService.getClaims(user_id).map(
                claims -> ResponseEntity
                        .status(HttpStatus.OK)
                        .body(claims)
        );
    }
}

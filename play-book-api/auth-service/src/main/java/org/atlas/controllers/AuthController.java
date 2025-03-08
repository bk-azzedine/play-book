package org.atlas.controllers;

import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.requests.SignInRequest;
import org.atlas.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthServiceInterface authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/generate/token")
    public Mono<ResponseEntity<String>> generateToken(@RequestBody Map<String, Object> tokenGenerationRequest) {
          return authService.generateToken(tokenGenerationRequest)
                  .map(token -> ResponseEntity.ok().body(token));
    }

    @PostMapping("/authenticate")
    public Mono<ResponseEntity<Void>> authenticate(@RequestBody SignInRequest signInRequest) {
        return authService.authenticate(signInRequest)
                .map(signInResponse -> ResponseEntity.ok()
                        .header("Authorization", "Bearer " + signInResponse.token())
                        .build()
                );
    }


    @PostMapping("/validate/token")
    public Mono<ResponseEntity<Boolean>> validateToken(@RequestBody String token) {
    return authService.validateToken(token)
            .map(isValid ->
                    new ResponseEntity<>(isValid, HttpStatus.OK)
                    );
    }
}

//
//    @GetMapping("/claims")
//    public ResponseEntity<Boolean> getClaims(@RequestBody String token ){
//        boolean isValid = authService.validateToken(token);
//        return new ResponseEntity<>(isValid, HttpStatus.OK);
//    }



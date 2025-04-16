package org.atlas.controllers;

import io.jsonwebtoken.Claims;
import org.atlas.entities.User;
import org.atlas.interfaces.ActivationServiceInterface;
import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.requests.SignInRequest;
import org.atlas.requests.ValidateCodeRequest;
import org.atlas.responses.CodeResponse;
import org.atlas.services.ActivationService;
import org.atlas.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthServiceInterface authService;
    private final ActivationServiceInterface activationService;


    @Autowired
    public AuthController(AuthService authService, ActivationService activationService) {
        this.authService = authService;
        this.activationService = activationService;
    }

    @PostMapping("/generate/token")
    public Mono<ResponseEntity<String>> generateToken(@RequestBody User user) {

          return authService.generateToken(user)
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
        System.out.println(token);
    return authService.validateToken(token)
            .map(isValid ->
                    new ResponseEntity<>(isValid, HttpStatus.OK)
                    );
    }

    @GetMapping("/generate/code/{userId}")
    public Mono<ResponseEntity<String>> generateActivationCode(@PathVariable("userId") UUID userId ) {
        return activationService.generateActivationCode(userId).map(code ->ResponseEntity.ok()
                .body(code)
        );
    }
    @PostMapping("/resend/code")
    public Mono<ResponseEntity<CodeResponse>> generateActivationCode( @RequestHeader("email") String email ) {
        return activationService.resendCode(email).map(res -> ResponseEntity.ok()
                .body(new CodeResponse(res))
        );
    }
    @PostMapping("/validate/code")
    public Mono<ResponseEntity<Boolean>> validateCode(@RequestBody ValidateCodeRequest codeRequest, @RequestHeader("Authorization") String authHeader) {
        return activationService.validateAccount(codeRequest.code(), authHeader)
                .map(response -> {
                    Boolean isValidated = (Boolean) response.get("validated");
                    ResponseEntity.BodyBuilder builder = ResponseEntity.ok();
                    if (isValidated && response.containsKey("token")) {

                        builder.header("Authorization", "Bearer " + response.get("token"));
                    }
                    return builder.body(isValidated);
                });
    }

    @GetMapping("/claims/{token}")
    public Mono<ResponseEntity<HashMap<String, List<?>>>> getALlClaims(@PathVariable("token") String token) {
        return authService.getUserClaims(token).map(code -> ResponseEntity.ok()
                .body(code)
        );
    }

}





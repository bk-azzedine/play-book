package org.atlas.controllers;

import org.atlas.dtos.UserDto;
import org.atlas.entities.User;

import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.interfaces.CodeServiceInterface;
import org.atlas.requests.*;
import org.atlas.responses.CodeResponse;
import org.atlas.responses.ForgotPassResponse;
import org.atlas.responses.ValidateCodeResponse;
import org.atlas.services.CodeService;
import org.atlas.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;

import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthServiceInterface authService;
    private final CodeServiceInterface codeService;


    @Autowired
    public AuthController(AuthService authService, CodeService codeService) {
        this.authService = authService;
        this.codeService = codeService;
    }

    @PostMapping("/generate/token")
    public Mono<ResponseEntity<HashMap<String,String>>> generateToken(@RequestBody User user) {
          return authService.generateToken(user)
                  .map(token -> ResponseEntity.ok().body(token));
    }

    @PostMapping("/authenticate")
    public Mono<ResponseEntity<UserDto>> authenticate(@RequestBody SignInRequest signInRequest) {
        return authService.authenticate(signInRequest)
                .map(signInResponse -> {
                    ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", signInResponse.refreshToken())
                            .httpOnly(true)
                            .path("/")
                            .sameSite("Strict")
                            .maxAge(Duration.ofDays(10))
                            .build();
                    return ResponseEntity.ok()
                            .header("Authorization", "Bearer " + signInResponse.accessToken())
                            .header(HttpHeaders.SET_COOKIE, String.valueOf(refreshTokenCookie))
                            .body(signInResponse.user());
                });
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
        return codeService.generateActivationCode(userId).map(code ->ResponseEntity.ok()
                .body(code)
        );
    }
    @PostMapping("/resend/code")
    public Mono<ResponseEntity<CodeResponse>> generateActivationCode( @RequestHeader("email") String email ) {
        return codeService.resendCode(email).map(res -> ResponseEntity.ok()
                .body(new CodeResponse(res))
        );
    }
    @PostMapping("/validate/code")
    public Mono<ResponseEntity<Boolean>> validateCode(@RequestBody ValidateCodeRequest codeRequest, @RequestHeader("Authorization") String authHeader) {
        return codeService.validateAccount(codeRequest.code(), authHeader)
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

    @PostMapping("/refresh-token")
    public Mono<ResponseEntity<UserDto>> refreshToken(ServerWebExchange exchange) {
        return authService.generateAccessFromRefresh(Objects.requireNonNull(exchange.getRequest().getCookies().getFirst("refresh_token")).getValue())
                .map(refreshResponse -> {
                    return ResponseEntity.ok()
                            .header("Authorization", "Bearer " + refreshResponse.accessToken())
                            .body(refreshResponse.user());
                });

    }

    @PostMapping("/logout")
    public Mono<ResponseEntity<Void>> logout(ServerWebExchange exchange ) {
        return authService.logOut(Objects.requireNonNull(exchange.getRequest().getCookies().getFirst("refresh_token")).getValue(), Objects.requireNonNull(exchange.getRequest().getHeaders().getFirst("Authorization")).substring(7)).map(
                res -> {
                    return ResponseEntity.ok()
                            .build();
                }
        );
    }
    @PostMapping("/forgot-password")
    public Mono<ResponseEntity<ForgotPassResponse>> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest ) {
        return codeService.forgotPassword(forgotPasswordRequest.email())
                .map(res -> {
                    return ResponseEntity.ok()
                            .body(new ForgotPassResponse(res));
                });
    }

    @PostMapping("/forgot-password/validate")
    public Mono<ResponseEntity<ValidateCodeResponse>> validateReset(@RequestBody PasswordValidationCodeRequest passwordValidationCodeRequest ) {
        return codeService.validateReset(passwordValidationCodeRequest.code())
                .map(res -> {
                    return ResponseEntity.ok()
                            .body(new ValidateCodeResponse(res));
                });
    }

    @PostMapping("/forgot-password/reset-password")
    public Mono<ResponseEntity<ValidateCodeResponse>> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest  ) {
        return authService.resetPassword(resetPasswordRequest)
                .map(res -> {
                    return ResponseEntity.ok()
                            .body(new ValidateCodeResponse(res));
                });
    }
}





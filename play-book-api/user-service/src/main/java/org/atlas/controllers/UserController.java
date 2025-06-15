package org.atlas.controllers;

import lombok.extern.slf4j.Slf4j;
import org.atlas.dtos.UserDto;
import org.atlas.entities.User;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.requests.SignUpRequest;
import org.atlas.responses.SignUpResponse;
import org.atlas.services.AuthService;
import org.atlas.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceInterface userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public Mono<ResponseEntity<UserDto>> register(@RequestBody SignUpRequest signUpRequest) {
        return userService.registerUser(signUpRequest)
                .map(response -> {
                            ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", response.refreshToken())
                                    .httpOnly(true)
                                    .path("/")
                                    .sameSite("Strict")
                                    .maxAge(Duration.ofDays(10))
                                    .build();
                            return ResponseEntity
                                    .status(HttpStatus.CREATED)
                                    .header("Authorization", "Bearer " + response.accessToken())
                                    .header(HttpHeaders.SET_COOKIE, String.valueOf(refreshTokenCookie))
                                    .body(response.user());
                        }
                );
    }

    @PostMapping("/register/{invite}")
    public Mono<ResponseEntity<UserDto>> registerWithInvite(@RequestBody SignUpRequest signUpRequest, @PathVariable("invite") UUID inviteCode) {
        return userService.registerUserWithInvite(signUpRequest,inviteCode)
                .map(response -> {
                            ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", response.refreshToken())
                                    .httpOnly(true)
                                    .path("/")
                                    .sameSite("Strict")
                                    .maxAge(Duration.ofDays(10))
                                    .build();
                            return ResponseEntity
                                    .status(HttpStatus.CREATED)
                                    .header("Authorization", "Bearer " + response.accessToken())
                                    .header(HttpHeaders.SET_COOKIE, String.valueOf(refreshTokenCookie))
                                    .body(response.user());
                        }
                );
    }


    @GetMapping("/check/{email}")
    public Mono<ResponseEntity<Boolean>> checkIfEmailExists(@PathVariable("email") String email) {
        return this.userService.checkIfEmailExists(email)
                .map(state -> ResponseEntity.status(HttpStatus.OK).body(state));
    }


    @GetMapping("/security/{email}")
    public Mono<ResponseEntity<User>> findUserByEmail(@PathVariable("email") String email) {
        return userService.findUserByEmail(email)
                .map(user -> ResponseEntity
                        .status(HttpStatus.OK)
                        .body(user)
                );
    }
    @GetMapping("/security/user/{userId}")
    public Mono<ResponseEntity<User>> findUserById(@PathVariable("userId") String userId) {
        return userService.findUserById(userId)
                .map(user -> ResponseEntity
                        .status(HttpStatus.OK)
                        .body(user)
                );
    }
    @PostMapping("/security/update-password/")
    public Mono<ResponseEntity<User>> updatePassword( @RequestBody  User user) {
        return userService.updatePassword(user)
                .map(updatedUser -> ResponseEntity
                        .status(HttpStatus.OK)
                        .body(updatedUser)
                );
    }

    @PostMapping("/validate/user/{userId}")
    public Mono<ResponseEntity<Boolean>> validateUser(@PathVariable("userId") UUID userId) {
        return userService.validateUser(userId)
                .map(response -> ResponseEntity
                        .status(HttpStatus.OK)
                        .body(response)
                );
    }

    @GetMapping("/doc/authors")
    public ResponseEntity<Flux<UserDto>> getDocAuthors(@RequestParam("ids") List<UUID> userIds) {
        Flux<UserDto> authors = userService.getDocAuthors(userIds);
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/org/members")
    public ResponseEntity<Flux<UserDto>> getOrganizationMembers(@RequestParam("ids") List<UUID> userIds) {
        Flux<UserDto> members = userService.getTeamMembers(userIds);
        return ResponseEntity.ok(members);
    }


}

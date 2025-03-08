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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

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
                .map(response -> ResponseEntity
                        .status(HttpStatus.CREATED)
                        .header("Authorization", "Bearer " + response.token())
                        .body(response.user())
                );
    }

    @GetMapping("/{email}")
    public Mono<ResponseEntity<User>> findUserByEmail(@PathVariable("email") String email) {
          return  userService.findUserByEmail(email)
                  .map(user -> ResponseEntity
                          .status(HttpStatus.OK)
                          .body(user)
                  );
    }


}

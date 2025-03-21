package org.atlas.services;

import org.atlas.repositories.UserRepository;
import org.atlas.dtos.UserDto;
import org.atlas.entities.User;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.requests.SignUpRequest;
import org.atlas.responses.SignUpResponse;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.HashMap;

import static org.atlas.exceptions.Exceptions.EXCEPTION_01;
import static org.atlas.exceptions.Exceptions.EXCEPTION_03;

@Service
public class UserService implements UserServiceInterface {
    private final UserRepository userRepository;
    final Logger logger =
            LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;
    private final AuthServiceInterface authService;
    private final ModelMapper modelMapper;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthService authService, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.modelMapper = modelMapper;
    }

    @Override
    public Mono<User> saveUser(SignUpRequest signUpRequest) {
        return userRepository.existsByEmail(signUpRequest.email())
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_01)));
                    }

                    User user = User.builder()
                            .firstName(signUpRequest.firstName())
                            .lastName(signUpRequest.lastName())
                            .email(signUpRequest.email())
                            .password(passwordEncoder.encode(signUpRequest.password()))
                            .build();

                    return userRepository.save(user);
                });
    }

    @Override
    public Mono<SignUpResponse> registerUser(SignUpRequest signUpRequest) {
        var claims = new HashMap<String, Object>();

        return saveUser(signUpRequest)
                .flatMap(user -> {
                    UserDto userDto = modelMapper.map(user, UserDto.class);
                    claims.put("firstname", user.getFirstName());
                    claims.put("lastname", user.getLastName());

                    return authService.generateToken(claims, user.getEmail())
                            .map(token -> new SignUpResponse(userDto, token));
                });
    }

    @Override
    public Mono<User> findUserByEmail(String email) {
        logger.info("Fetching user with email: {}", email);
        return userRepository.findUserByEmail(email)
                .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03))));
    }


}

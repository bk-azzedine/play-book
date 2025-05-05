package org.atlas.services;

import org.atlas.enums.RoutingKeys;
import org.atlas.interfaces.UserPublishServiceInterface;
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
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static org.atlas.exceptions.Exceptions.*;

@Service
public class UserService implements UserServiceInterface {

    private final UserRepository userRepository;
    private final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;
    private final AuthServiceInterface authService;
    private final ModelMapper modelMapper;
    private final UserPublishServiceInterface userPublishService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthService authService, ModelMapper modelMapper, UserPublishService userPublishService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.modelMapper = modelMapper;
        this.userPublishService = userPublishService;
    }

    @Override
    public Mono<User> saveUser(SignUpRequest signUpRequest) {
        logger.info("Attempting to save user with email: {}", signUpRequest.email());
        return userRepository.existsByEmail(signUpRequest.email())
                .flatMap(exists -> {
                    if (exists) {
                        logger.warn("Email already exists: {}", signUpRequest.email());
                        return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_01)));
                    }
                    User user = User.builder()
                            .firstName(signUpRequest.firstName())
                            .lastName(signUpRequest.lastName())
                            .email(signUpRequest.email())
                            .isEnabled(true)
                            .isActivated(false)
                            .isSetUp(false)
                            .password(passwordEncoder.encode(signUpRequest.password()))
                            .build();
                    logger.info("Saving new user: {}", user.getEmail());
                    return userRepository.save(user)
                            .doOnSuccess(savedUser -> logger.info("User saved successfully: {}", savedUser.getUserId()))
                            .doOnError(err -> logger.error("Error saving user: {}", err.getMessage()));
                });
    }

    @Override
    @Transactional
    public Mono<SignUpResponse> registerUser(SignUpRequest signUpRequest) {
        logger.info("Registering user: {}", signUpRequest.email());
        return saveUser(signUpRequest)
                .flatMap(user -> authService.generateActivationCode(user.getUserId())
                        .doOnSuccess(code -> logger.info("Activation code generated for user {}: {}", user.getUserId(), code))
                        .flatMap(code -> {
                            UserDto userDto = modelMapper.map(user, UserDto.class);

                            HashMap<String, Object> map = new HashMap<>();
                            map.put("activationCode", code);
                            map.put("to", user.getEmail());
                            map.put("subject", user.getLastName());

                            logger.info("Publishing activation message to broker for user: {}", user.getEmail());
                            boolean published = userPublishService.publishMessage("data-exchange", RoutingKeys.USER_ACTIVATE_ACCOUNT.getValue(), map);

                            if (!published) {
                                logger.error("Failed to publish activation message for user: {}", user.getEmail());
                                return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_02)));
                            }

                            return authService.generateToken(userDto)
                                    .doOnSuccess(token -> logger.info("Token generated for user: {}", user.getEmail()))
                                    .map(tokenMap -> {
                                        logger.info("User registration completed for: {}", user.getEmail());
                                        return new SignUpResponse(userDto,  tokenMap.get("access" ), tokenMap.get("refresh"));
                                    });
                        })
                        .doOnError(err -> logger.error("Error during activation/token generation for user {}: {}", user.getEmail(), err.getMessage()))
                );
    }

    @Override
    public Mono<User> findUserByEmail(String email) {
        logger.info("Fetching user with email: {}", email);
        return userRepository.findUserByEmail(email)
                .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03))))
                .doOnSuccess(user -> logger.info("User found: {}", user.getEmail()))
                .doOnError(err -> logger.error("User not found or error occurred: {}", err.getMessage()));
    }

    @Override
    public Mono<Boolean> checkIfEmailExists(String email) {
        logger.info("Checking if email exists: {}", email);
        return userRepository.existsByEmail(email)
                .doOnSuccess(exists -> logger.info("Email exists: {} - {}", email, exists))
                .doOnError(err -> logger.error("Error checking email existence: {}", err.getMessage()));
    }

    @Override
    public Mono<Boolean> validateUser(UUID userId) {
        logger.info("Validating user with ID: {}", userId);
        return userRepository.findById(userId)
                .doOnSuccess(user -> logger.info("User found for validation: {}", user.getEmail()))
                .flatMap(user -> {
                    user.setActivated(true);
                    return userRepository.save(user)
                            .doOnSuccess(updatedUser -> logger.info("User activated: {}", updatedUser.getEmail()))
                            .map(savedUser -> true);
                })
                .doOnError(err -> logger.error("Error validating user {}: {}", userId, err.getMessage()));
    }

    @Override
    public Flux<UserDto> getDocAuthors(List<UUID> userIds) {
        return userRepository.findAllByUserIdIn(userIds)
                .map(user -> modelMapper.map(user, UserDto.class));
    }
}

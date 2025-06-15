package org.atlas.services;

import org.atlas.enums.RoutingKeys;
import org.atlas.interfaces.CompanyServiceInterface;
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
    private final CompanyServiceInterface companyService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthService authService, ModelMapper modelMapper, UserPublishService userPublishService, CompanyService companyService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
        this.modelMapper = modelMapper;
        this.userPublishService = userPublishService;
        this.companyService = companyService;
    }

    @Override
    public Mono<User> saveUser(SignUpRequest signUpRequest, boolean isSetUp) {
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
                            .isSetUp(isSetUp)
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
        return saveUser(signUpRequest, false)
                .flatMap(user -> authService.generateActivationCode(user.getUserId())
                        .doOnSuccess(code -> logger.info("Activation code generated for user {}: {}", user.getUserId(), code))
                        .flatMap(code -> {
                            UserDto userDto = modelMapper.map(user, UserDto.class);

                            HashMap<String, Object> map = new HashMap<>();
                            map.put("messageType", "ACTIVATION_CODE");
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
    public Mono<SignUpResponse> registerUserWithInvite(SignUpRequest signUpRequest, UUID inviteCode) {
        logger.info("Registering user: {}", signUpRequest.email());
        return companyService.validateInviteCode(inviteCode.toString()).flatMap(
                isValid -> {
                    if (!isValid) {
                        logger.warn("Invalid invite code: {}", inviteCode);
                        return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_04)));
                    }
                    return saveUser(signUpRequest, true).flatMap(user -> authService.generateActivationCode(user.getUserId())
                            .doOnSuccess(code -> logger.info("Activation code generated for user {}: {}", user.getUserId(), code))
                            .flatMap(code -> {
                                UserDto userDto = modelMapper.map(user, UserDto.class);

                                HashMap<String, Object> map = new HashMap<>();
                                map.put("messageType", "ACTIVATION_CODE");
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
                                        .flatMap(tokenMap -> {
                                            // Register user with company after successful token generation
                                            return companyService.registerWithCompany(inviteCode.toString(), user.getUserId().toString())
                                                    .doOnSuccess(result -> logger.info("User {} registered with company: {}", user.getEmail(), result))
                                                    .doOnError(error -> logger.error("Failed to register user {} with company: {}", user.getEmail(), error.getMessage()))
                                                    .then(Mono.just(new SignUpResponse(userDto, tokenMap.get("access"), tokenMap.get("refresh"))))
                                                    .doOnSuccess(response -> logger.info("User registration completed for: {}", user.getEmail()));
                                        });
                            })
                            .doOnError(err -> logger.error("Error during activation/token generation for user {}: {}", user.getEmail(), err.getMessage()))
                    );
                }
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
    public Mono<User> findUserById(String userId) {
        logger.info("Fetching user with id: {}", userId);
        return userRepository.findById(UUID.fromString(userId))
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

    @Override
    public Flux<UserDto> getTeamMembers(List<UUID> userIds) {
        return userRepository.findAllByUserIdIn(userIds)
                .map(user -> modelMapper.map(user, UserDto.class));
    }

    /**
     * Updates a user's password after hashing it.
     * The 'user' parameter should contain the ID of the user and the new PLAIN-TEXT password.
     *
     * @param user An object containing the user's ID and their new plain-text password.
     * @return A Mono emitting the updated User object, or an error if the user is not found.
     */
    @Override
    public Mono<User> updatePassword(User user) {

        return userRepository.findById(user.getUserId())
                .flatMap(foundUser -> {
                    foundUser.setPassword(user.getPassword());
                    return userRepository.save(foundUser);
                });
    }
}

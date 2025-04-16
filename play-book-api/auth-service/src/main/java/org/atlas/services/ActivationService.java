package org.atlas.services;

import org.atlas.entities.ActivationCode;
import org.atlas.entities.User;
import org.atlas.enums.RoutingKeys;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.ActivationServiceInterface;
import org.atlas.interfaces.AuthPublishServiceInterface;
import org.atlas.interfaces.JwtServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.repositories.ActivationCodeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.UUID;

import static org.atlas.exceptions.Exceptions.*;

@Service
public class ActivationService implements ActivationServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(ActivationService.class);

    private final ActivationCodeRepository activationCodeRepository;
    private final UserServiceInterface customUserServiceDetails;
    private final AuthPublishServiceInterface authPublishService;
    private final JwtServiceInterface jwtService;

    @Autowired
    public ActivationService(ActivationCodeRepository activationCodeRepository, CustomUserServiceDetails customUserServiceDetails, AuthPublishService authPublishService, JwtService jwtService) {
        this.activationCodeRepository = activationCodeRepository;
        this.customUserServiceDetails = customUserServiceDetails;
        this.authPublishService = authPublishService;
        this.jwtService = jwtService;
        logger.info("ActivationService initialized with dependencies");
    }

    @Override
    public Mono<String> generateActivationCode(UUID userID) {
        logger.info("Starting activation code generation for user: {}", userID);

        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < 6; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        String generatedCode = codeBuilder.toString();
        logger.debug("Generated 6-digit code for user: {}", userID);

        ActivationCode activationCode = ActivationCode.builder()
                .code(generatedCode)
                .userId(userID)
                .used(false)
                .createdAt(LocalDateTime.now())
                .expiredAt(LocalDateTime.now().plusMinutes(10))
                .build();

        logger.debug("Built activation code entity with expiry: {}", activationCode.getExpiredAt());

        return activationCodeRepository.save(activationCode)
                .doOnSuccess(savedCode -> logger.info("Successfully saved activation code for user: {}", userID))
                .doOnError(error -> logger.error("Error saving activation code for user: {}: {}", userID, error.getMessage()))
                .map(ActivationCode::getCode);
    }

    @Override
    public Mono<HashMap<String, Object>> validateAccount(String code, String authHeader) {
        logger.info("Starting account validation with code: {}", code);

        // Step 1: Verify the activation code exists
        return verifyCodeExists(code)
                .then(validateAuthHeader(authHeader))
                .flatMap(token -> processTokenAndValidateUser(token, code));
    }

    @Override
    public Mono<String> resendCode(String email) {
        logger.info("Attempting to resend activation code for email: {}", email);

        return customUserServiceDetails.findUserByEmail(email)
                .doOnNext(user -> logger.info("User found with email: {}", email))
                .flatMap(user -> {
                    logger.debug("Generating new activation code for user ID: {}", user.getUser_id());

                    return generateActivationCode(user.getUser_id())
                            .doOnNext(code -> logger.debug("Activation code generated successfully"))
                            .flatMap(code -> {
                                HashMap<String, Object> map = new HashMap<>();
                                map.put("activationCode", code);
                                map.put("to", user.getEmail());
                                map.put("subject", user.getLastName());

                                logger.info("Publishing activation message to broker for user: {}", user.getEmail());
                                boolean published = authPublishService.publishMessage(
                                        "data-exchange",
                                        RoutingKeys.AUTH_ACTIVATE_ACCOUNT.getValue(),
                                        map
                                );

                                if (published) {
                                    logger.info("Successfully published activation message for user: {}", user.getEmail());
                                    return Mono.just("Code sent, check your mail");
                                } else {
                                    logger.error("Failed to publish activation message for user: {}", user.getEmail());
                                    return Mono.error(new RuntimeException("Failed to send activation email"));
                                }
                            });
                })
                .switchIfEmpty(Mono.defer(() -> {
                    logger.warn("User not found for email: {}", email);
                    return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03)));
                }))
                .doOnError(e -> logger.error("Error in resendCode process: {}", e.getMessage()))
                .onErrorResume(e -> Mono.just("Failed to send code: " + e.getMessage()));
    }

    /**
     * Verify that the provided activation code exists in the database
     */
    private Mono<Void> verifyCodeExists(String code) {
        return activationCodeRepository.existsByCode(code)
                .doOnSuccess(exists -> logger.debug("Code existence check result: {}", exists))
                .flatMap(exists -> {
                    if (!exists) {
                        logger.warn("Activation code does not exist: {}", code);
                        return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_05)));
                    }
                    return Mono.empty();
                });
    }

    /**
     * Validate the authorization header and extract the token
     */
    private Mono<String> validateAuthHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.error("Invalid authorization header format");
            return Mono.error(new InvalidAuthHeaderException("Invalid authorization header"));
        }

        String token = authHeader.substring(7);
        logger.debug("Extracted JWT token from header, length: {}", token.length());
        return Mono.just(token);
    }

    /**
     * Process the token and validate the user
     */
    private Mono<HashMap<String, Object>> processTokenAndValidateUser(String token, String code) {
        return jwtService.extractUsername(token)
                .doOnSuccess(email -> logger.debug("Extracted email from token: {}", email))
                .doOnError(error -> logger.error("Failed to extract email from token: {}", error.getMessage()))
                .flatMap(email -> findUserAndValidate(email, code))
                .onErrorResume(InvalidAuthHeaderException.class, e -> {
                    HashMap<String, Object> response = new HashMap<>();
                    response.put("validated", false);
                    response.put("reason", "invalid_auth_header");
                    return Mono.just(response);
                });
    }

    /**
     * Find the user by email and validate with the activation code
     */
    private Mono<HashMap<String, Object>> findUserAndValidate(String email, String code) {
        return customUserServiceDetails.findUserByEmail(email)
                .flatMap(user -> validateUserWithCode(user, code))
                .switchIfEmpty(createErrorResponse("user_not_found"));
    }

    /**
     * Validate the user with the given activation code
     */
    private Mono<HashMap<String, Object>> validateUserWithCode(User user, String code) {
        logger.debug("Looking up activation code for code: {} and user ID: {}", code, user.getUser_id());

        return activationCodeRepository.findByCodeAndUserId(code, user.getUser_id())
                .flatMap(activationCode -> validateActivationCode(activationCode, user))
                .switchIfEmpty(createErrorResponse("code_not_found"));
    }

    /**
     * Validate that the activation code is not expired
     */
    /**
     * Validate that the activation code is not expired and mark as used if valid
     */
    private Mono<HashMap<String, Object>> validateActivationCode(ActivationCode activationCode, User user) {
        if (activationCode == null) {
            logger.warn("No activation code found for user ID: {}", user.getUser_id());
            return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_05)));
        }

        if (activationCode.isUsed()) {
            logger.warn("Activation code already used for user: {}", user.getUser_id());
            return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_07)));
        }

        if (activationCode.getExpiredAt().isBefore(LocalDateTime.now())) {
            logger.warn("Activation code expired at {} for user: {}",
                    activationCode.getExpiredAt(), user.getUser_id());
            return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_06)));
        }

        logger.debug("Activation code is valid, proceeding to validate user: {}", user.getUser_id());

        // Mark the activation code as used
        activationCode.setUsed(true);

        return activationCodeRepository.save(activationCode)
                .flatMap(savedCode -> {
                    logger.info("Activation code marked as used: {}", savedCode.getCode());
                    return performUserValidation(user);
                });
    }

    /**
     * Perform user validation and generate new token if successful
     */
    private Mono<HashMap<String, Object>> performUserValidation(User user) {
        return customUserServiceDetails.validateUser(user.getUser_id())
                .flatMap(valid -> {
                    if (valid) {
                        logger.info("Successfully validated user: {}", user.getUser_id());
                        return generateNewTokenForUser(user);
                    } else {
                        logger.warn("Failed to validate user: {}", user.getUser_id());
                        return createErrorResponse("validation_failed");
                    }
                });
    }

    /**
     * Generate a new token for the validated user
     */
    private Mono<HashMap<String, Object>> generateNewTokenForUser(User user) {
        // Re-fetch the user to get the updated activation status
        return customUserServiceDetails.findUserByEmail(user.getEmail())
                .flatMap(updatedUser -> jwtService.generateToken(updatedUser)
                        .map(newToken -> {
                            HashMap<String, Object> response = new HashMap<>();
                            response.put("validated", true);
                            response.put("token", newToken);
                            return response;
                        }))
                .switchIfEmpty(createErrorResponse("user_refresh_failed"));
    }

    /**
     * Create an error response with the specified reason
     */
    private Mono<HashMap<String, Object>> createErrorResponse(String reason) {
        HashMap<String, Object> response = new HashMap<>();
        response.put("validated", false);
        response.put("reason", reason);
        return Mono.just(response);
    }

    /**
     * Custom exception for invalid auth header
     */
    private static class InvalidAuthHeaderException extends RuntimeException {
        public InvalidAuthHeaderException(String message) {
            super(message);
        }
    }
}
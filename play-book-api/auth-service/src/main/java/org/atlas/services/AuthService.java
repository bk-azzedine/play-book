package org.atlas.services;

import org.atlas.dtos.UserDto;
import org.atlas.entities.User;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.interfaces.JwtServiceInterface;
import org.atlas.repositories.CodesRepository;
import org.atlas.repositories.TokenRepository;
import org.atlas.requests.ResetPasswordRequest;
import org.atlas.requests.SignInRequest;
import org.atlas.responses.SignInResponse;
import org.atlas.responses.refreshResponse;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

import static org.atlas.exceptions.Exceptions.*;

@Service
public class AuthService implements AuthServiceInterface {

    private final CustomUserServiceDetails customUserServiceDetails;
    private final JwtServiceInterface jwtService;
    private final CodesRepository codesRepository;
    private final ReactiveAuthenticationManager authenticationManager;
    private final WebClient organizationWebClient;
    private final ModelMapper modelMapper;
    private final TokenRepository tokenRepository;
    private final Retry serviceCallRetry;
    private final PasswordEncoder passwordEncoder;
    private final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    public AuthService(
            CustomUserServiceDetails customUserServiceDetails,
            JwtServiceInterface jwtService, CodesRepository codesRepository,
            ReactiveAuthenticationManager authenticationManager,
            @Qualifier("organizationWebClient") WebClient organizationWebClient,
            ModelMapper modelMapper,
            TokenRepository tokenRepository,
            Retry serviceCallRetry, PasswordEncoder passwordEncoder) {

        this.customUserServiceDetails = customUserServiceDetails;
        this.jwtService = jwtService;
        this.codesRepository = codesRepository;
        this.authenticationManager = authenticationManager;
        this.organizationWebClient = organizationWebClient;
        this.modelMapper = modelMapper;
        this.tokenRepository = tokenRepository;
        this.serviceCallRetry = serviceCallRetry;
        this.passwordEncoder = passwordEncoder;
    }



    @Override
    public Mono<HashMap<String, String>>  generateToken(User user) {
        return jwtService.generateTokens(user).flatMap(Mono::just);
    }

    @Override
    public Mono<SignInResponse> authenticate(SignInRequest request) {
        return authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email(),
                                request.password()
                        )
                )
                .onErrorMap(BadCredentialsException.class, ex -> {

                    return new Exception(ExceptionHandler.processEnum(EXCEPTION_04));
                })
                .flatMap(auth -> {
                    var user = (User) auth.getPrincipal();
                    var claims = this.getUserClaims(user.getUserId());

                    return jwtService.generateTokens(claims, user).map(
                            res ->{
                                    UserDto userDto = modelMapper.map(user, UserDto.class);
                                  return  new SignInResponse(res.get("access"),res.get("refresh"), userDto );
                            }
                    );

                });
    }

    @Override
    public Mono<Boolean> validateToken(String token) {
        logger.info("Starting token validation for token: {}", token);

        // First check if token exists in the database
        return jwtService.getToken(token)
                .doOnSubscribe(subscription -> logger.info("Fetching token from db"))
                .flatMap(tokenEntity -> {
                    // If token exists in DB and is not expired, proceed with JWT validation
                    if (tokenEntity.getExpires().isAfter(LocalDateTime.now()) && tokenEntity.is_valid()) {
                        logger.info("Token found in database and not expired");

                        return jwtService.extractUsername(token)
                                .doOnSubscribe(subscription -> logger.info("Extracting username from token"))
                                .flatMap(username -> {
                                    logger.info("Username extracted: {}", username);
                                    return customUserServiceDetails.findByUsername(username)
                                            .doOnSubscribe(sub -> logger.info("Fetching user details for username: {}", username))
                                            .flatMap(userDetails -> {
                                                logger.info("User details found: {}", userDetails);
                                                return jwtService.validateToken(token, userDetails)
                                                        .doOnSubscribe(sub2 -> logger.info("Validating token with user details"))
                                                        .doOnSuccess(valid -> logger.info("Token validation result: {}", valid));
                                            })
                                            .defaultIfEmpty(false);
                                });
                    } else {
                        logger.info("Token expired or invalid in database");
                        return Mono.just(false);
                    }
                })
                .defaultIfEmpty(false)
                .onErrorResume(error -> {
                    logger.error("Error during token validation: {}", error.getMessage());
                    return Mono.just(false);
                })
                .doOnTerminate(() -> logger.info("Token validation process completed"));
    }

    @Override
    public Mono<HashMap<String, List<Object>>> getUserClaims(UUID userId) {
        logger.info("Fetching claims for user: {}", userId);

        return organizationWebClient.get()
                .uri("/security/claims/{user_id}", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<HashMap<String, List<Object>>>() {})
                .retryWhen(serviceCallRetry)
                .timeout(Duration.ofSeconds(3))
                .doOnError(error -> logger.error("Claims fetch failed: {}", error.getMessage()))
                .onErrorMap(error -> new Exception(ExceptionHandler.processEnum(EXCEPTION_02), error))
                .defaultIfEmpty(new HashMap<>());
    }

    @Override
    public Mono<HashMap<String, List<?>>> getUserClaims(String token) {
        return jwtService.getAllClaimsFromToken(token).map(claim -> {
            HashMap<String, List<?>> claims = new HashMap<>();
            claims.put("email", Collections.singletonList(claim.getSubject()));
            return claims;
        });
    }
    @Override
    public Mono<refreshResponse> generateAccessFromRefresh(String refreshToken) {
        logger.info("Starting generation of access token from refresh token: {}", refreshToken);

        return jwtService.getToken(refreshToken)
                .doOnSubscribe(sub -> logger.info("Fetching token entity from database"))
                .flatMap(token -> {
                    if (!token.is_valid()) {
                        logger.warn("Refresh token is invalid: {}", token);
                        return Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_04)));
                    }
                    logger.info("Token entity retrieved and valid: {}", token);
                    return jwtService.extractUsername(refreshToken);
                })
                .doOnNext(username -> logger.info("Extracted username: {}", username))
                .flatMap(customUserServiceDetails::findUserByEmail)
                .doOnNext(user -> logger.info("User found by email: {}", user))
                .flatMap(user ->
                        getUserClaims(user.getUserId())
                                .doOnNext(claims -> logger.info("User claims retrieved: {}", claims))
                                .flatMap(claims -> jwtService.generateAccess(claims, user)
                                        .map(accessToken -> {
                                            logger.info("Access token generated successfully: {}", accessToken);
                                            UserDto userDto = modelMapper.map(user, UserDto.class);
                                            return new refreshResponse(accessToken, userDto);
                                        })
                                )
                )
                .onErrorResume(error -> {
                    logger.error("Error during access token generation from refresh: {}", error.getMessage(), error);
                    return Mono.error(error);
                })
                .doOnTerminate(() -> logger.info("Access token generation process completed"));
    }



    @Override
    public Mono<Void> logOut(String refreshToken, String accessToken) {
        logger.info("Starting logout process for accessToken and refreshToken");

        return jwtService.getToken(accessToken)
                .flatMap(accessTok -> {
                    logger.info("Access token found: {}", accessTok);
                    accessTok.set_valid(false);
                    logger.info("Access token set to invalid. Saving access token...");
                    return tokenRepository.save(accessTok)
                            .doOnSuccess(savedAccessToken -> logger.info("Access token successfully saved: {}", savedAccessToken))
                            .doOnError(e -> logger.error("Error while saving access token: {}", e.getMessage()))
                            .then(jwtService.getToken(refreshToken));
                })
                .flatMap(refreshTok -> {
                    logger.info("Refresh token found: {}", refreshTok);
                    refreshTok.set_valid(false);
                    logger.info("Refresh token set to invalid. Saving refresh token...");
                    return tokenRepository.save(refreshTok)
                            .doOnSuccess(savedRefreshToken -> logger.info("Refresh token successfully saved: {}", savedRefreshToken))
                            .doOnError(e -> logger.error("Error while saving refresh token: {}", e.getMessage()));
                })
                .doOnSuccess(unused -> logger.info("Logout process completed successfully."))
                .doOnError(e -> logger.error("Error during logout process: {}", e.getMessage()))
                .then(); // Complete with Mono<Void>
    }

    @Override
    public Mono<String> resetPassword(ResetPasswordRequest resetPasswordRequest) {
        return codesRepository.findByCode(resetPasswordRequest.code())
                .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_010)))) // Handle code not found early
                .flatMap(codeEntity -> {

                    return customUserServiceDetails.findUserById(String.valueOf(codeEntity.getUserId()))
                            .switchIfEmpty(Mono.error(new Exception(ExceptionHandler.processEnum(EXCEPTION_03))))
                            .flatMap(user -> {
                                // 3. Update the user's password
                                user.setPassword(passwordEncoder.encode(resetPasswordRequest.password()));
                                return customUserServiceDetails.updatePassword(user); // This returns Mono<User>
                            })
                            .flatMap(updatedUser -> {
                                // 4. Invalidate the reset code after successful password update
                                codeEntity.setUsed(true); // Mark as used
                                return codesRepository.save(codeEntity) // Save the updated code entity
                                        .thenReturn("Password reset successfully."); // Return success message
                            });
                });
    }
}

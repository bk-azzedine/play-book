package org.atlas.services;


import org.atlas.entities.User;
import org.atlas.exceptions.Exception;
import org.atlas.exceptions.ExceptionHandler;
import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.interfaces.JwtServiceInterface;
import org.atlas.requests.SignInRequest;
import org.atlas.responses.SignInResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import java.util.UUID;

import static org.atlas.exceptions.Exceptions.EXCEPTION_02;
import static org.atlas.exceptions.Exceptions.EXCEPTION_04;

@Service
public class AuthService  implements AuthServiceInterface {

    private final CustomUserServiceDetails customUserServiceDetails;
    private final JwtServiceInterface jwtService;
    private final ReactiveAuthenticationManager authenticationManager;
    private final WebClient organizationWebClient;
    final Logger logger =
            LoggerFactory.getLogger(AuthService.class);

    @Autowired
    public AuthService(
            CustomUserServiceDetails customUserServiceDetails,
            JwtServiceInterface jwtService,
            ReactiveAuthenticationManager authenticationManager,
            @Qualifier("organizationWebClient") WebClient organizationWebClient) {

        this.customUserServiceDetails = customUserServiceDetails;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.organizationWebClient = organizationWebClient;
    }


//    @Override
//    public Mono<String> generateToken(Map<String,Object> tokenGenerationRequest) {
//        @SuppressWarnings("unchecked")
//        HashMap<String, Object> claims = (HashMap<String, Object>) tokenGenerationRequest.get("claims");
//        String username = (String) tokenGenerationRequest.get("username");
//        return jwtService.generateToken(claims,username);
//    }


    @Override
    public Mono<String> generateToken(User user) {
        return jwtService.generateToken(user).flatMap(Mono::just);
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
                    var claims = this.getUserClaims(user.getUser_id());

                    return jwtService.generateToken(claims, user)
                            .map(SignInResponse::new);
                });
    }

    @Override
    public Mono<Boolean> validateToken(String token) {
        logger.info("Starting token validation for token: {}", token);

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
                                        .doOnSuccess(valid -> logger.info("Token validation result: {}", valid))
                                        .defaultIfEmpty(false)
                                        .doOnError(error -> logger.error("Error during token validation: {}", error.getMessage()));
                            })
                            .defaultIfEmpty(false)
                            .doOnError(error -> logger.error("User not found for username: {}", username));
                })
                .doOnError(error -> logger.error("Error extracting username from token: {}", error.getMessage()))
                .defaultIfEmpty(false)
                .doOnTerminate(() -> logger.info("Token validation process completed"));
    }

    @Override
    public Mono<HashMap<String, List<Object>>> getUserClaims(UUID userId) {
        logger.info("Fetching claims for user: {}", userId);

        return organizationWebClient.get()
                .uri("/security/claims/{user_id}", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<HashMap<String, List<Object>>>() {})
                .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof WebClientResponseException))
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

//    @Transactional
//    public void activateAccount(String token) throws MessagingException {
//        Token savedToken = tokenRepository.findByToken(token)
//                // todo exception has to be defined
//                .orElseThrow(() -> new RuntimeException("Invalid token"));
//        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
//            sendValidationEmail(savedToken.getUser());
//            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
//        }
//
//        var user = userRepository.findById(savedToken.getUser().getId())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        user.setEnabled(true);
//        userRepository.save(user);
//
//        savedToken.setValidatedAt(LocalDateTime.now());
//        tokenRepository.save(savedToken);
//    }

//    private String generateAndSaveActivationToken(User user) {
//
//        String generatedToken = generateActivationCode(6);
//        var token = Token.builder()
//                .token(generatedToken)
//                .createdAt(LocalDateTime.now())
//                .expiresAt(LocalDateTime.now().plusMinutes(15))
//                .user(user)
//                .build();
//        tokenRepository.save(token);
//
//        return generatedToken;
//    }
//
//
//

}
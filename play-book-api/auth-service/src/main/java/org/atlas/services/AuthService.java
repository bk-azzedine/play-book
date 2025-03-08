package org.atlas.services;

import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.interfaces.JwtServiceInterface;
import org.atlas.requests.SignInRequest;
import org.atlas.responses.SignInResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService  implements AuthServiceInterface {

    private final CustomUserServiceDetails customUserServiceDetails;
    private final JwtServiceInterface jwtService;
    private final ReactiveAuthenticationManager authenticationManager;

    @Autowired
    public AuthService( CustomUserServiceDetails customUserServiceDetails, JwtServiceInterface jwtService, ReactiveAuthenticationManager authenticationManager) {
        this.customUserServiceDetails = customUserServiceDetails;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }


    @Override
    public Mono<String> generateToken(Map<String,Object> tokenGenerationRequest) {
        @SuppressWarnings("unchecked")
        HashMap<String, Object> claims = (HashMap<String, Object>) tokenGenerationRequest.get("claims");
        String username = (String) tokenGenerationRequest.get("username");
        return jwtService.generateToken(claims,username);
    }

    @Override
    public Mono<SignInResponse> authenticate(SignInRequest request) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        ).flatMap(auth -> {
            var claims = new HashMap<String, Object>();
            var user = (UserDetails) auth.getPrincipal();
            claims.put("fullName", user.getUsername());

            return jwtService.generateToken(claims, user)
                    .map(SignInResponse::new);
        });
    }

    @Override
    public Mono<Boolean> validateToken(String token) {
        return jwtService.extractUsername(token)
                .flatMap(username -> customUserServiceDetails.findByUsername(username)
                        .flatMap(userDetails -> jwtService.validateToken(token, userDetails))
                        .defaultIfEmpty(false))
                .onErrorReturn(false);
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
//    private String generateActivationCode(int length) {
//        String characters = "0123456789";
//        StringBuilder codeBuilder = new StringBuilder();
//
//        SecureRandom secureRandom = new SecureRandom();
//
//        for (int i = 0; i < length; i++) {
//            int randomIndex = secureRandom.nextInt(characters.length());
//            codeBuilder.append(characters.charAt(randomIndex));
//        }
//
//        return codeBuilder.toString();
//    }
}
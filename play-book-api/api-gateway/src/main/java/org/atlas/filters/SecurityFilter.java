package org.atlas.filters;


import org.atlas.interfaces.AuthServiceInterface;
import org.atlas.services.AuthService;
import org.atlas.services.RouteValidatorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;


@RefreshScope
@Component
public class SecurityFilter implements GlobalFilter {

    final Logger logger =
            LoggerFactory.getLogger(SecurityFilter.class);

    private final RouteValidatorService routeValidatorService;//custom route validator
    private final AuthServiceInterface authService;

    public SecurityFilter(RouteValidatorService routeValidatorService, AuthService authService) {
        this.routeValidatorService = routeValidatorService;
        this.authService = authService;
    }


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        System.out.println("SecurityFilter is being executed!");
        ServerHttpRequest request = exchange.getRequest();
        String requestPath = request.getPath().toString();

        logger.info("Processing request: {} {}", request.getMethod(), requestPath);

        if (routeValidatorService.isSecured.test(request)) {
            logger.info("Secured route detected: {} {}", request.getMethod(), requestPath);

            if (this.authService.isAuthMissing(request)) {
                logger.warn("Authorization header missing for secured route: {}", requestPath);
                return this.onError(exchange, "Authorization header is missing in request", HttpStatus.UNAUTHORIZED);
            }

            final String token = this.authService.getAuthHeader(request);
            logger.debug("Authorization token received, validating...");

            return authService.validateToken(token).flatMap(isValid -> {
                logger.info(isValid.toString());
                if (!isValid) {
                    logger.warn("Invalid authorization token for request: {}", requestPath);
                    return this.onError(exchange, "Authorization header is invalid", HttpStatus.UNAUTHORIZED);
                }

                logger.info("Authentication successful for request: {}", requestPath);
                return chain.filter(exchange);
            });

//            this.populateRequestWithHeaders(exchange, token);
        } else {
            logger.debug("Non-secured route accessed: {}", requestPath);
        }
        return chain.filter(exchange);
    }


    /*PRIVATE*/

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        logger.error("Request error: {} - Status: {}", err, httpStatus);
        return response.setComplete();
    }



//    private void populateRequestWithHeaders(ServerWebExchange exchange, String token) {
//        Claims claims = jwtUtil.getAllClaimsFromToken(token);
//        exchange.getRequest().mutate()
//                .header("id", String.valueOf(claims.get("id")))
//                .header("role", String.valueOf(claims.get("role")))
//                .build();
//    }
}
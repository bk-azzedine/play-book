package org.atlas.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Filter that adds a correlation ID to each request for distributed tracing
 */
@Component
public class CorrelationIdFilter implements WebFilter {

    private static final Logger logger = LoggerFactory.getLogger(CorrelationIdFilter.class);
    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String CORRELATION_ID_MDC_KEY = "correlationId";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String correlationId = exchange.getRequest().getHeaders().getFirst(CORRELATION_ID_HEADER);
        
        // If no correlation ID is provided, generate a new one
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = generateCorrelationId();
            logger.debug("Generated new correlation ID: {}", correlationId);
        } else {
            logger.debug("Using existing correlation ID: {}", correlationId);
        }
        
        // Add the correlation ID to the response headers
        exchange.getResponse().getHeaders().add(CORRELATION_ID_HEADER, correlationId);
        
        // Store the correlation ID in the MDC for logging
        final String finalCorrelationId = correlationId;
        
        return chain.filter(exchange)
                .contextWrite(context -> context.put(CORRELATION_ID_MDC_KEY, finalCorrelationId))
                .doOnSubscribe(subscription -> MDC.put(CORRELATION_ID_MDC_KEY, finalCorrelationId))
                .doFinally(signalType -> MDC.remove(CORRELATION_ID_MDC_KEY));
    }
    
    /**
     * Generates a unique correlation ID
     * 
     * @return A unique correlation ID
     */
    private String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }
}
package org.atlas.configs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.util.retry.Retry;

import java.time.Duration;

/**
 * Configuration for retry mechanisms in reactive services
 */
@Configuration
public class RetryConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(RetryConfig.class);
    
    /**
     * Creates a default retry configuration for service-to-service communication
     * 
     * @return Retry configuration with exponential backoff
     */
    @Bean
    public Retry serviceCallRetry() {
        return Retry.backoff(3, Duration.ofMillis(500))
                .maxBackoff(Duration.ofSeconds(2))
                .doBeforeRetry(retrySignal -> 
                    logger.warn("Retrying service call, attempt: {}", retrySignal.totalRetries() + 1))
                .doAfterRetry(retrySignal -> 
                    logger.info("Retry attempt {} completed", retrySignal.totalRetries()))
                .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> {
                    logger.error("Retry attempts exhausted after {} attempts", retrySignal.totalRetries());
                    return retrySignal.failure();
                });
    }
}
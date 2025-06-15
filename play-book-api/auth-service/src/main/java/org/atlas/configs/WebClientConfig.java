package org.atlas.configs;

import org.atlas.filters.CorrelationIdWebClientFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Configuration for WebClient instances with correlation ID propagation
 */
@Configuration
public class WebClientConfig {

    private final CorrelationIdWebClientFilter correlationIdFilter;

    public WebClientConfig(CorrelationIdWebClientFilter correlationIdFilter) {
        this.correlationIdFilter = correlationIdFilter;
    }

    /**
     * Creates a WebClient for user-service with correlation ID propagation
     * 
     * @return WebClient instance
     */
    @Bean
    public WebClient userWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8081/user/")
                .filter(correlationIdFilter)
                .build();
    }

    /**
     * Creates a WebClient for organization-service with correlation ID propagation
     * 
     * @return WebClient instance
     */
    @Bean
    public WebClient organizationWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8083/org/")
                .filter(correlationIdFilter)
                .build();
    }
}

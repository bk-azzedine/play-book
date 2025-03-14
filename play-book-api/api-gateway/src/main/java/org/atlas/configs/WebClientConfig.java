package org.atlas.configs;


import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;


@Configuration
public class WebClientConfig {

    @Bean
    public WebClient authWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8082/auth/")
                .build();
    }
}
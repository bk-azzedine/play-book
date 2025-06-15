package org.atlas.filters;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import reactor.core.publisher.Mono;

/**
 * WebClient filter that propagates correlation IDs to outgoing requests
 */
@Component
public class CorrelationIdWebClientFilter implements ExchangeFilterFunction {

    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String CORRELATION_ID_MDC_KEY = "correlationId";

    @Override
    public Mono<ClientResponse> filter(ClientRequest request, ExchangeFunction next) {
        // Get the correlation ID from the MDC
        final String correlationIdFromMDC = MDC.get(CORRELATION_ID_MDC_KEY);

        // If correlation ID is found in the MDC, add it to the request
        if (correlationIdFromMDC != null && !correlationIdFromMDC.isEmpty()) {
            ClientRequest filteredRequest = ClientRequest.from(request)
                    .header(CORRELATION_ID_HEADER, correlationIdFromMDC)
                    .build();

            return next.exchange(filteredRequest);
        }

        // If no correlation ID is found in the MDC, try to get it from the request context
        return Mono.deferContextual(contextView -> {
            if (contextView.hasKey(CORRELATION_ID_MDC_KEY)) {
                final String correlationIdFromContext = contextView.get(CORRELATION_ID_MDC_KEY);

                // Add the correlation ID to the outgoing request
                ClientRequest filteredRequest = ClientRequest.from(request)
                        .header(CORRELATION_ID_HEADER, correlationIdFromContext)
                        .build();

                return next.exchange(filteredRequest);
            }

            // If no correlation ID is found, proceed with the original request
            return next.exchange(request);
        });
    }
}

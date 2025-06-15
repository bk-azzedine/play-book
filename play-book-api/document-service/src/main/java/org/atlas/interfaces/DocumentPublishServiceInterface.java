package org.atlas.interfaces;

import reactor.core.publisher.Mono;

public interface DocumentPublishServiceInterface {
    boolean publishMessage(String exchange, String routingKey, Object message);
}

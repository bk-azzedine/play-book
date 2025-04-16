package org.atlas.interfaces;

public interface AuthPublishServiceInterface {
    boolean publishMessage(String exchange, String routingKey, Object message);
}

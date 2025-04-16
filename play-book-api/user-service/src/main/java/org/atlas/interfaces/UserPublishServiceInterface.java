package org.atlas.interfaces;

public interface UserPublishServiceInterface {
    boolean publishMessage(String exchange, String routingKey, Object message);
}

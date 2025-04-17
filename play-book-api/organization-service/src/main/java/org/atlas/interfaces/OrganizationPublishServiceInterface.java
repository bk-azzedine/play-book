package org.atlas.interfaces;

public interface OrganizationPublishServiceInterface {
    boolean publishMessage(String exchange, String routingKey, Object message);
}

package org.atlas.services;

import org.atlas.interfaces.AuthPublishServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthPublishService implements AuthPublishServiceInterface {
    private final RabbitTemplate rabbitTemplate;
    private final String exchangeName = "email-exchange";
    final Logger logger =
            LoggerFactory.getLogger(AuthPublishService.class);
    @Autowired
    public AuthPublishService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public boolean publishMessage(String exchange, String routingKey, Object message) {
        try {
            logger.info("Publishing message to exchange: {}, routing key: {}", exchange, routingKey);
            rabbitTemplate.convertAndSend(exchange, routingKey, message);
            logger.info("Message published successfully");
            return true;
        } catch (AmqpException e) {
            logger.error("Failed to publish message to exchange: {}, routing key: {}", exchange, routingKey, e);
            return false;
        }
    }
}

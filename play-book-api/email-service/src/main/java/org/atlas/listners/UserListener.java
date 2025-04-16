package org.atlas.listners;

import jakarta.mail.MessagingException;
import org.atlas.enums.Template;
import org.atlas.interfaces.EmailServiceInterface;
import org.atlas.services.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;

@Configuration
public class UserListener {

    private final EmailServiceInterface emailService;
    final Logger logger =
            LoggerFactory.getLogger(UserListener.class);
    @Autowired
    public UserListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = "${spring.rabbitmq.template.default-receive-queue}")
    public void receiveMessage(HashMap<String, Object> map) throws MessagingException {
           logger.info("Received Message: {}", map);
           emailService.sendEmail(
                   map.get("to").toString(),
                   map.get("subject").toString(),
                   Template.ACTIVATION_CODE,
                   map.get("activationCode").toString(),
                   map.get("subject").toString()
           );
    }
}

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
public class Listener {

    private final EmailServiceInterface emailService;
    final Logger logger =
            LoggerFactory.getLogger(Listener.class);

    @Autowired
    public Listener(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = "${spring.rabbitmq.template.default-receive-queue}")
    public void receiveMessage(HashMap<String, Object> map) throws MessagingException {
        logger.info("Received Message: {}", map);

        String messageType = (String) map.get("messageType");

        if (messageType == null) {
            logger.error("Message type not specified in the message: {}", map);
            return;
        }



        switch (messageType) {
            case "ACTIVATION_CODE":
                handleActivationCode(map);
                break;
            case "TEAM_INVITE":
                handleTeamInvite(map);
                break;
            default:
                logger.warn("Unknown message type: {}", messageType);
        }
    }

    private void handleActivationCode(HashMap<String, Object> map) throws MessagingException {
        emailService.sendActivationEmail(
                map.get("to").toString(),
                map.get("subject").toString(),
                Template.ACTIVATION_CODE,
                map.get("activationCode").toString(),
                map.get("subject").toString()
        );
        logger.info("Sent activation code email to: {}", map.get("to"));
    }

    private void handleTeamInvite(HashMap<String, Object> map) throws MessagingException {
        emailService.sendInviteEmail(
                map.get("email").toString(),
                Template.TEAM_INVITE,
                map.get("invite_id").toString(),
                map.get("team_name").toString(),
                map.get("organization_name").toString()
        );
        logger.info("Sent team invite email to: {}", map.get("email"));
    }
}

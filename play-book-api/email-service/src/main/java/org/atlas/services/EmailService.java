package org.atlas.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.atlas.enums.Template;
import org.atlas.interfaces.EmailServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class EmailService implements EmailServiceInterface {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine springTemplateEngine;

    @Autowired
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine springTemplateEngine) {
        this.mailSender = mailSender;
        this.springTemplateEngine = springTemplateEngine;
        logger.info("EmailService initialized with mailSender: {}", mailSender.getClass().getSimpleName());
    }

    @Override
    public void sendActivationEmail(String to,
                                    String username,
                                    Template templateEnum,
                                    String activationCode,
                                    String subject) throws MessagingException {
        logger.info("Preparing to send activation email to: {}", to);
        logger.debug("Using template: {}, for user: {}", templateEnum.getValue(), username);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, UTF_8.name());

            Map<String, Object> properties = new HashMap<>();
            properties.put("username", username);
            properties.put("activationCode", activationCode);
            logger.debug("Email properties set: {}", properties);

            Context context = new Context();
            context.setVariables(properties);

            helper.setFrom("support@playbook.com");
            helper.setTo(to);
            helper.setSubject(subject);

            String template = springTemplateEngine.process(templateEnum.getValue(), context);
            logger.debug("Template processed successfully, content length: {}", template.length());

            helper.setText(template, true);

            logger.info("Sending activation email to: {}", to);
            mailSender.send(mimeMessage);
            logger.info("Activation email successfully sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send activation email to: {}", to, e);
            throw e;
        }
    }

    @Override
    public void sendInviteEmail(
            String to,
            Template templateEnum,
            String inviteToken,
            String teamName,
            String orgName,
            String teamDescription,
            String teamRole
    ) throws MessagingException {
        logger.info("Preparing to send team invitation email to: {}", to);
        logger.debug("Invitation details - Team: {}, Organization: {}", teamName, orgName);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, UTF_8.name());

            Map<String, Object> properties = new HashMap<>();
            properties.put("inviteToken", inviteToken);
            properties.put("teamName", teamName);
            properties.put("orgName", orgName);
            properties.put("teamDescription", teamDescription);
            properties.put("teamRole", teamRole);
            logger.debug("Email properties set: {}", properties);

            Context context = new Context();
            context.setVariables(properties);

            helper.setFrom("support@playbook.com");
            helper.setTo(to);
            helper.setSubject(String.format("Invitation to join %s team at %s", teamName, orgName));

            String template = springTemplateEngine.process(templateEnum.getValue(), context);
            logger.debug("Template processed successfully, content length: {}", template.length());

            helper.setText(template, true);

            logger.info("Sending invitation email to: {}", to);
            mailSender.send(mimeMessage);
            logger.info("Invitation email successfully sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send invitation email to: {} for team: {}", to, teamName, e);
            throw e;
        }
    }

    @Override
    public void sendForgotPasswordEmail(String to, Template templateEnum, String resetCode) throws MessagingException {
        logger.info("Preparing to send password reset email to: {}", to);
        logger.debug("Password reset details - reset code , email", resetCode, to );

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, UTF_8.name());

            Map<String, Object> properties = new HashMap<>();
            properties.put("resetCode", resetCode);
            logger.debug("Email properties set: {}", properties);

            Context context = new Context();
            context.setVariables(properties);

            helper.setFrom("support@playbook.com");
            helper.setTo(to);
            helper.setSubject("Password Reset Request");

            String template = springTemplateEngine.process(templateEnum.getValue(), context);
            logger.debug("Template processed successfully, content length: {}", template.length());

            helper.setText(template, true);

            logger.info("Sending invitation email to: {}", to);
            mailSender.send(mimeMessage);
            logger.info("Invitation email successfully sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to:{}", to);
            throw e;
        }
    }
}
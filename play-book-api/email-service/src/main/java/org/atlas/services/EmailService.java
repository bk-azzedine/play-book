package org.atlas.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.atlas.enums.Template;
import org.atlas.interfaces.EmailServiceInterface;
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
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine springTemplateEngine;

    @Autowired
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine springTemplateEngine) {
        this.mailSender = mailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    @Override
    public void sendEmail(String to,
                          String username,
                          Template templateEnum,
                          String activationCode,
                          String subject) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, UTF_8.name());
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("activationCode", activationCode);
        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("support@playbook.com");
        helper.setTo(to);
        helper.setSubject(subject);

        String template = springTemplateEngine.process(templateEnum.getValue(), context);

        helper.setText(template, true);

        mailSender.send(mimeMessage);

    }
}

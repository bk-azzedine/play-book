package org.atlas;

import jakarta.mail.MessagingException;
import org.atlas.services.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class testController {
    private final EmailService emailService;

    public testController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/email")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest email) throws MessagingException {
        emailService.sendEmail(email.getTo(),email.getUsername(), email.getTemplateEnum(), email.getActivationCode(),email.getSubject());
        return ResponseEntity.ok("Email sent");
    }
}

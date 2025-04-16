package org.atlas.interfaces;

import jakarta.mail.MessagingException;
import org.atlas.enums.Template;

public interface EmailServiceInterface {
    void sendEmail(String to,
                   String username,
                   Template templateEnum,
                   String activationCode,
                   String subject) throws MessagingException;
}

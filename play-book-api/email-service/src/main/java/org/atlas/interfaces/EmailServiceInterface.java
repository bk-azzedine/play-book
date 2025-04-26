package org.atlas.interfaces;

import jakarta.mail.MessagingException;
import org.atlas.enums.Template;

public interface EmailServiceInterface {
    void sendActivationEmail(String to,
                             String username,
                             Template templateEnum,
                             String activationCode,
                             String subject) throws MessagingException;

    void sendInviteEmail( String to,
                          Template template,
                          String inviteToken,
                          String teamName,
                          String orgName) throws MessagingException;
}

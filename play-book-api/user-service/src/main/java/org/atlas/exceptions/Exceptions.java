package org.atlas.exceptions;

import lombok.Getter;
import org.springframework.web.client.HttpServerErrorException;

import static org.atlas.exceptions.ExceptionType.*;

@Getter
public enum Exceptions {
      EXCEPTION_01("EMAIL ALREADY EXISTS", CONFLICT),
      EXCEPTION_02("REGISTRATION TIMEOUT, PLEASE TRY AGAIN", GATEWAY_TIMEOUT),
      EXCEPTION_03("USER NOT FOUND", NOT_FOUND),
      EXCEPTION_04("INVITE CODE INVALID", CONFLICT);


    public final String message;
    public final ExceptionType exceptionType;

    Exceptions(String message, ExceptionType exceptionType) {
        this.message = message;
        this.exceptionType = exceptionType;
    }

}

package org.atlas.exceptions;

import lombok.Getter;

import static org.atlas.exceptions.ExceptionType.*;

@Getter
public enum Exceptions {
      EXCEPTION_01("EMAIL ALREADY EXISTS", CONFLICT),
      EXCEPTION_02("LOGIN FAILED, PLEASE TRY AGAIN", GATEWAY_TIMEOUT),
      EXCEPTION_03("USER NOT FOUND", NOT_FOUND),
      EXCEPTION_04("INVALID CREDENTIALS", UNAUTHORIZED),
    EXCEPTION_05("CODE IS WRONG, TRY AGAIN", NOT_FOUND),
     EXCEPTION_06("THIS CODE IS EXPIRED", BAD_REQUEST),
    EXCEPTION_07("THIS CODE IS ALREADY USED", BAD_REQUEST),
    EXCEPTION_08("REFRESH TOKEN NOT FOUND", NOT_FOUND),
    EXCEPTION_09("TOKEN INVALID", NOT_FOUND);


    public final String message;
    public final ExceptionType exceptionType;

    Exceptions(String message, ExceptionType exceptionType) {
        this.message = message;
        this.exceptionType = exceptionType;
    }

}

package org.atlas.exceptions;

import lombok.Getter;

import static org.atlas.exceptions.ExceptionType.*;

@Getter
public enum Exceptions {
      EXCEPTION_01("TEAM_NOT_FOUND", NOT_FOUND),
    EXCEPTION_02("ORGANIZATION_NOT_FOUND", NOT_FOUND);


    public final String message;
    public final ExceptionType exceptionType;

    Exceptions(String message, ExceptionType exceptionType) {
        this.message = message;
        this.exceptionType = exceptionType;
    }

}

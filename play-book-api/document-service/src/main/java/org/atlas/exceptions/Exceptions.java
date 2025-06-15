package org.atlas.exceptions;

import lombok.Getter;

import static org.atlas.exceptions.ExceptionType.NOT_FOUND;

@Getter
public enum Exceptions {
      EXCEPTION_01("SPACE_IS_NULL", NOT_FOUND);



    public final String message;
    public final ExceptionType exceptionType;

    Exceptions(String message, ExceptionType exceptionType) {
        this.message = message;
        this.exceptionType = exceptionType;
    }

}

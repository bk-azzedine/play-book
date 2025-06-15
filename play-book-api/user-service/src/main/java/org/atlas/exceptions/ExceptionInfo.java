package org.atlas.exceptions;

import lombok.Data;


public record ExceptionInfo( String message, ExceptionType exceptionType) {
}

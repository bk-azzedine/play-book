package org.atlas.exceptions;

public class Exception extends RuntimeException {
    ExceptionInfo exceptionInfo;

    public Exception(ExceptionInfo exceptionInfo) {
        super(exceptionInfo.message());
        this.exceptionInfo= exceptionInfo;
    }

    public Exception(ExceptionInfo exceptionInfo, Throwable t) {
        super(exceptionInfo.message(), t);
        this.exceptionInfo = exceptionInfo;
    }
}

package org.atlas.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(org.atlas.exceptions.Exception.class)
    public ResponseEntity<ExceptionInfo> handleCustomException(Exception ex) {

        ExceptionInfo exceptionInfo = ex.exceptionInfo;


        HttpStatus httpStatus = mapToHttpStatus(exceptionInfo.exceptionType());


        return new ResponseEntity<>(exceptionInfo, httpStatus);
    }

    private HttpStatus mapToHttpStatus(ExceptionType exceptionType) {
        return HttpStatus.valueOf(exceptionType.name());
    }
}
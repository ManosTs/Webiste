package com.project.website.config;

import com.project.website.entity.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

public class CustomExceptionHandling extends ResponseEntityExceptionHandler {
    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ExceptionResponse> handleException(String message,
                                                                   LocalDateTime date, HttpStatus status){
        return new ResponseEntity<>(
                new ExceptionResponse(
                        message,
                        date,
                        status
                ),status
        );
    }
}

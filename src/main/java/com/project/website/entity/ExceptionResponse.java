package com.project.website.entity;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public class ExceptionResponse {
    private String message;
    private LocalDateTime date;
    private HttpStatus status;

    public ExceptionResponse(String message, LocalDateTime date, HttpStatus status) {
        this.message = message;
        this.date = date;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public HttpStatus getStatus() {
        return status;
    }
}

package com.project.website.entity;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpStatusCodeException;

import java.time.LocalDateTime;

public class MessageResponse {
    private String message;
    private LocalDateTime date;
    private int status;

    public MessageResponse(String message, LocalDateTime date, int status) {
        super();
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

    public int getStatus() {
        return status;
    }
}

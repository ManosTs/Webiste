package com.project.website.controller;


import com.project.website.config.CustomExceptionHandling;
import com.project.website.entity.ExceptionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping(path = "/api/auth/page")
public class PageController {

    @GetMapping
    public ResponseEntity<ExceptionResponse> pageAuthentication() {
        return new CustomExceptionHandling().handleException("AUTHORIZED", LocalDateTime.now(), HttpStatus.OK);
    }
}

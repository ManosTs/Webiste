package com.project.website.controller;


import com.project.website.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/home")
public class HomePageController {


    @GetMapping
    public ResponseEntity<Object> home() {
        return ResponseEntity.status(HttpStatus.OK).body("AUTHORIZED");
    }
}

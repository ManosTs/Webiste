package com.project.website.controller;


import com.project.website.entity.User;
import com.project.website.repository.UserRepository;
import com.project.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/user")
public class UserController {
    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path= "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> registerUser(@RequestBody User user) {
        User userFound = userRepository.findByEmail(user.getEmail());

        if(userFound != null){
            return ResponseEntity.status(HttpStatus.FOUND).body("EMAIL ALREADY EXISTS"); //user exists

        }

        User newUser = userService.createUser(user.getEmail(), user.getUsername(), user.getPassword());

        return ResponseEntity.status(HttpStatus.OK).body(newUser);
    }

    @PostMapping(path= "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> loginUser(User user) {
        User userFound = userService.authUser(user.getEmail(), user.getPassword());

        if(userFound != null){
            return ResponseEntity.status(HttpStatus.OK).body(userFound);

        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }
}

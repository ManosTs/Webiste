package com.project.website.controller;


import com.project.website.config.JwtTokenUtil;
import com.project.website.entity.User;
import com.project.website.repository.UserRepository;
import com.project.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Base64;

@RestController
@RequestMapping(path = "/user")
public class UserController {

    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    public void setJwtTokenUtil(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    private AuthenticationManager authenticationManager;

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

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
    public ResponseEntity<Object> loginUser(@RequestBody User user, HttpServletResponse response) throws Exception {

        User userFound = userService.authUser(user.getEmail(), user.getPassword());

        if(userFound != null){
//            authenticate(user.getEmail(), user.getPassword());

            final String token = jwtTokenUtil.generateToken(userFound);
            String encodedToken = Base64.getEncoder().encodeToString(token.getBytes());

            userFound.setToken(encodedToken);

            userRepository.save(userFound);
            // create a cookie
            Cookie cookie = new Cookie("token", "Bearer%20"+encodedToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            //add cookie to
            response.addCookie(cookie);

            return ResponseEntity.status(HttpStatus.OK).build();
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }

    private void authenticate(String email, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}

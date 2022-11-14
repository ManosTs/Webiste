package com.project.website.controller;


import com.project.website.config.CustomExceptionHandling;
import com.project.website.config.JwtTokenUtil;
import com.project.website.entity.User;
import com.project.website.repository.UserRepository;
import com.project.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3030")
@RequestMapping(path = "/api/user")
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

    @PostMapping(path= "/register", consumes = "application/json", produces = "application/json; charset=utf-8")
    @ResponseBody
    public ResponseEntity<?> registerUser(@RequestBody User user) {


        if(isStringBlank(user.getEmail()) ||
                isStringBlank(user.getPassword()) ||
                isStringBlank(user.getUsername())){
            return new CustomExceptionHandling().handleException(
                    "NULL PROPERTIES",
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST);
        }



        User newUser = userService.createUser(user.getEmail(), user.getUsername(), user.getPassword());
        if(newUser == null){
            return new CustomExceptionHandling().handleException(
                    "EMAIL ALREADY EXISTS",
                    LocalDateTime.now(),
                    HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok()
                .body(newUser);
    }

    @PostMapping(path= "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpServletResponse response) throws Exception {
        Map<String, String> message = new HashMap<>();
        User userFound = userService.authUser(user.getEmail(), user.getPassword());

        if(userFound != null){

            //validate token and check if it is expired
            if(userFound.getToken() != null
                    && jwtTokenUtil.validateToken(userFound.getToken(), userFound)){
                addCookieToken(userFound.getToken(), response);
                return ResponseEntity.status(HttpStatus.OK).build();
            }

            //else if it is expired or null, create new token
            final String token = jwtTokenUtil.generateToken(userFound);

            userFound.setToken(token);
            userRepository.save(userFound);

            addCookieToken(token, response);

            message.put("RES", "SUCCESS");
            return ResponseEntity.status(HttpStatus.OK).body(message);

        }

        return new CustomExceptionHandling().handleException("ACCESS DENIED",
                LocalDateTime.now(),HttpStatus.FORBIDDEN);
    }

    @PutMapping(path= "/{id}/update", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateUser(@PathVariable String id, @RequestBody User user){
        User userFound = userRepository.findUserById(id);

        if(userFound == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("USER NOT FOUND");
        }

        userFound.setUsername(user.getUsername());
        userFound.setPassword(user.getPassword());

        userRepository.save(userFound);

        return ResponseEntity.status(HttpStatus.OK).body("USER UPDATED");
    }

    @DeleteMapping(path= "/{id}/delete", produces = "application/json")
    public ResponseEntity<Object> deleteUser(@PathVariable String id){
        User userDelete = userRepository.findUserById(id);

        if(userDelete == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("USER NOT FOUND");
        }

        userRepository.delete(userDelete);

        return ResponseEntity.status(HttpStatus.OK).body("USER DELETED");
    }

    @GetMapping(path= "/getAll", produces = "application/json")
    public ResponseEntity<Object> getUsers(@RequestParam(value="pageNo") int pageNo,
                                           @RequestParam(value="pageSize") int pageSize){

        Page<User> page = userService.findUsersPaginated(pageNo, pageSize);

        if(page.getContent().isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO USERS TO RETRIEVE");

        return ResponseEntity.status(HttpStatus.OK).body(page);
    }

    @GetMapping(path= "/{id}", produces = "application/json")
    public ResponseEntity<Object> getUser(@PathVariable String id){
        Map<?, ?> userDetails = userService.userDetails(id);

        if(userDetails.get("email") == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO USER");

        return ResponseEntity.status(HttpStatus.OK).body(userDetails);
    }

    private boolean isStringBlank(String string){
        return string == null || string.trim().isEmpty();
    }
    private void addCookieToken(String token, HttpServletResponse response){
        // create a cookie
        ResponseCookie cookie = ResponseCookie.from("token", "Bearer%20"+token)
                .httpOnly(true)
                .secure(true)
                .domain("localhost")
                .path("/")
                .sameSite("Lax")
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}

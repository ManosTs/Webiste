package com.project.website.controller;


import com.project.website.config.JwtTokenUtil;
import com.project.website.entity.User;
import com.project.website.repository.UserRepository;
import com.project.website.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Base64;
import java.util.List;

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


            userFound.setToken(token);

            userRepository.save(userFound);
            // create a cookie
            Cookie cookie = new Cookie("token", "Bearer%20"+token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            //add cookie to
            response.addCookie(cookie);

            return ResponseEntity.status(HttpStatus.OK).build();
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
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
    public ResponseEntity<Object> getUsers(@RequestParam(value="pageNo") int pageNo, @RequestParam(value="pageSize") int pageSize){

        Page<User> page = userService.findUsersPaginated(pageNo, pageSize);

        if(page.getContent().isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO USERS TO RETRIEVE");

        return ResponseEntity.status(HttpStatus.OK).body(page);
    }

    @GetMapping(path= "/{id}", produces = "application/json")
    public ResponseEntity<Object> getUser(@PathVariable String id){
        User user = userRepository.findUserById(id);

        if(user == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO USER");

        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

}

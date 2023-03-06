package com.project.website.controller;


import com.project.website.config.JwtTokenUtil;
import com.project.website.entity.Friend;
import com.project.website.entity.MessageResponse;
import com.project.website.entity.RefreshToken;
import com.project.website.entity.User;
import com.project.website.repository.RefreshTokenRepository;
import com.project.website.repository.UserRepository;
import com.project.website.service.RefreshTokenService;
import com.project.website.service.UserService;
import io.jsonwebtoken.impl.DefaultClaims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
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
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Ref;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3030")
@RequestMapping(path = "/api/user")
public class UserController {

    private final JwtTokenUtil jwtTokenUtil;

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final UserService userService;

    private final RefreshTokenService refreshTokenService;

    private final RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public UserController(JwtTokenUtil jwtTokenUtil,
                          AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          UserService userService,
                          RefreshTokenService refreshTokenService,
                          RefreshTokenRepository refreshTokenRepository) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @PostMapping(path= "/public/register", consumes = "application/json", produces = "application/json; charset=utf-8")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) throws ParseException {
        Map<String, String> message = new HashMap<>();

//        if(isStringBlank(user.getEmail()) ||
//                isStringBlank(user.getPassword()) ||
//                isStringBlank(user.getUsername())){
//            message.put("STATUS", "NULL PROPERTIES");
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
//        }



        User newUser = userService.createUser(user);
        if(newUser == null){
            message.put("STATUS", "EMAIL ALREADY EXISTS");
            message.put("CODE", String.valueOf(HttpStatus.BAD_REQUEST.value()));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }

        message.put("STATUS", "REGISTERED SUCCESSFULLY");
        message.put("CODE", String.valueOf(HttpStatus.OK.value()));
        return ResponseEntity.ok()
                .body(message);
    }

    @PostMapping(path= "/public/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpServletResponse response) throws Exception {
        Map<String, String> message = new HashMap<>();
        User userFound = userService.authUser(user.getEmail(), user.getPassword());

        if(userFound != null){
            try {
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userFound.getEmail(), user.getPassword()));
            }
            catch (DisabledException e) {
                throw new Exception("USER_DISABLED", e);
            } catch (BadCredentialsException e) {
                throw new Exception("INVALID_CREDENTIALS", e);
            }

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userFound.getId());
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", userFound.getRoles().toString());


            final String token = jwtTokenUtil.generateToken(userFound, claims);

            userFound.setAccessToken(token);

            userRepository.save(userFound);

            response.addHeader("Set-Cookie","access_token=Bearer%20"+ token + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+jwtTokenUtil.getExpirationDateFromToken(token)+";");
            response.addHeader("Set-Cookie","refresh_token="+ refreshToken.getToken() + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+refreshToken.getExpireDate()+";");

            return ResponseEntity.status(HttpStatus.OK).body(userFound);

        }
        message.put("STATUS", "REGISTERED SUCCESSFULLY");
        message.put("CODE", String.valueOf(HttpStatus.FORBIDDEN.value()));
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
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

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(path= "/getAll", produces = "application/json")
    public ResponseEntity<Object> getUsers(@RequestParam(name="pageNo") int pageNo,
                                           @RequestParam(name="pageSize") int pageSize){

        Page<User> page = userService.findUsersPaginated(pageNo, pageSize);

        if(page.getContent().isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.status(HttpStatus.OK).body(page);
    }

    @GetMapping(path= "/public/logout", produces = "application/json")
    public ResponseEntity<Object> logout(@RequestParam(name="id") String id, HttpServletResponse response){
        User user = userRepository.findUserById(id);
        Map<String, String> message = new HashMap<>();

        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        response.addHeader("Set-Cookie","access_token="+ null + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+0+";");
        response.addHeader("Set-Cookie","refresh_token="+ null + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+0+";");

        message.put("RESPONSE", "LOGOUT SUCCESSFULLY");
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @GetMapping(path= "/{id}", produces = "application/json")
    public ResponseEntity<Object> getUser(@PathVariable String id){
        User user = userRepository.findUserById(id);

        if(user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping(path = "/public/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request,
                                          HttpServletResponse response) throws IOException {
        Map<String, String> result = new HashMap<>();
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                result.put(cookie.getName(), cookie.getValue());
            }
        }
        RefreshToken refreshTokenFound = refreshTokenRepository.findRefreshTokenByToken(result.get("refresh_token"));

        if(refreshTokenFound == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        boolean isExpired = refreshTokenService.validateRefreshToken(refreshTokenFound);
        if(isExpired){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        DefaultClaims claims = (DefaultClaims) request.getAttribute("claims");
        String newToken = "";
        try {
            newToken = jwtTokenUtil.generateToken(refreshTokenFound.getUser(), claims);
            refreshTokenFound.getUser().setAccessToken(newToken);
            userRepository.save(refreshTokenFound.getUser());
            response.addHeader("Set-Cookie","access_token=Bearer%20"+ newToken + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+jwtTokenUtil.getExpirationDateFromToken(newToken)+";");
            response.addHeader("Set-Cookie","refresh_token="+ refreshTokenFound.getToken() + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+refreshTokenFound.getExpireDate()+";");
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (IllegalArgumentException e) {
            System.out.println("Unable to get JWT Token");

        }




        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();



    }

    @PutMapping(path = "/addFriend/{friendID}")
    public ResponseEntity<?> addFriend(@PathVariable String friendID, HttpServletRequest request){
        Map<String, String> result = new HashMap<>();
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                result.put(cookie.getName(), cookie.getValue());
            }
        }
        String requestToken = "";
        if(result.get("access_token") != null){

            requestToken = decodeBase64Token(result.get("access_token"));

        }
        String userID = jwtTokenUtil.getUserIDFromToken(requestToken.substring(7));

        User user = userRepository.findUserById(userID);

        if(user == null){
            return ResponseEntity.badRequest().body("ID NOT FOUND");
        }

        Friend friend = new Friend();

        friend.setUser(user);
        friend.setFriendId(friendID);

        user.addFriend(friend);

        userRepository.save(user);
        return ResponseEntity.ok().body("OK");
    }
    private String decodeBase64Token(String encodedString) {


        return URLDecoder.decode(encodedString, StandardCharsets.UTF_8);
    }
}

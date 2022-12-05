package com.project.website.controller;


import com.project.website.config.JwtTokenUtil;
import com.project.website.entity.MessageResponse;
import com.project.website.entity.RefreshToken;
import com.project.website.entity.User;
import com.project.website.repository.RefreshTokenRepository;
import com.project.website.repository.UserRepository;
import com.project.website.service.RefreshTokenService;
import com.project.website.service.UserService;
import io.jsonwebtoken.impl.DefaultClaims;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.net.URI;
import java.sql.Ref;
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

    private RefreshTokenService refreshTokenService;

    @Autowired
    public void setRefreshTokenService(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public void setRefreshTokenRepository(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @PostMapping(path= "/register", consumes = "application/json", produces = "application/json; charset=utf-8")
    @ResponseBody
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        Map<String, String> message = new HashMap<>();

        if(isStringBlank(user.getEmail()) ||
                isStringBlank(user.getPassword()) ||
                isStringBlank(user.getUsername())){
            message.put("STATUS", "NULL PROPERTIES");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }



        User newUser = userService.createUser(user.getEmail(), user.getUsername(), user.getPassword());
        if(newUser == null){
            message.put("STATUS", "EMAIL ALREADY EXISTS");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
        message.put("STATUS", "REGISTERED SUCCESSFULLY");
        return ResponseEntity.ok()
                .body(message);
    }

    @PostMapping(path= "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpServletResponse response) throws Exception {

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

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
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

    @GetMapping(path= "/logout", produces = "application/json")
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

    @GetMapping(path = "/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request,
                                          HttpServletResponse response){
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

        final String newToken = jwtTokenUtil.generateToken(refreshTokenFound.getUser(), claims);

        refreshTokenFound.getUser().setAccessToken(newToken);
        userRepository.save(refreshTokenFound.getUser());

        response.addHeader("Set-Cookie","access_token=Bearer%20"+ newToken + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+jwtTokenUtil.getExpirationDateFromToken(newToken)+";");
        response.addHeader("Set-Cookie","refresh_token="+ refreshTokenFound.getToken() + "; Path=/; Secure; HttpOnly; SameSite=Lax; domain=localhost; Expires="+refreshTokenFound.getExpireDate()+";");

        return ResponseEntity.status(HttpStatus.OK).build();

    }

    @GetMapping(path= "/access_token", produces = "application/json")
    public ResponseEntity<Object> validateAccessToken(@RequestParam String id){
        User user = userRepository.findUserById(id);

        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        boolean isTokenValid = jwtTokenUtil.validateToken(user.getAccessToken(), user);

        if(!isTokenValid)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    private boolean isStringBlank(String string){
        return string == null || string.trim().isEmpty();
    }
}

package com.project.website.config;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.project.website.entity.User;
import com.project.website.service.UserService;
import io.jsonwebtoken.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.web.util.WebUtils;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {


    private UserService userService;

    @Autowired
    public void setUserService(@Lazy UserService userService) {
        this.userService = userService;
    }

    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    public void setJwtTokenUtil(@Lazy JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        Map<String, String> result = new HashMap<>();
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                result.put(cookie.getName(), cookie.getValue());
            }
        }


        String requestTokenHeader = "";
        if(result.get("access_token") != null){

            requestTokenHeader = decodeBase64Token(result.get("access_token"));

        }


        String email = null;
        String jwtToken = null;

        if (requestTokenHeader != null
                        && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                email = jwtTokenUtil.getEmailFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                System.out.println("Unable to get JWT Token");
                if(!request.getRequestURI().equals("/api/user/public/logout"))
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            }catch (SignatureException e) {
                System.out.println("Unauthorized Token");
                if(!request.getRequestURI().equals("/api/user/public/logout"))
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            }catch (ExpiredJwtException e) {
                System.out.println("JWT Token has expired");
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        null, null, null);
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                request.setAttribute("claims", e.getClaims());

                if(!request.getRequestURI().equals("/api/user/public/refresh-token") && !request.getRequestURI().equals("/api/user/public/logout"))
                 response.sendError(HttpServletResponse.SC_UNAUTHORIZED);

            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String");
        }

        // Once we get the token validate it.
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            User userDetails = this.userService.loadUserByUsername(email);

            // if token is valid configure Spring Security to manually set
            // authentication
            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        chain.doFilter(request, response);
    }
    private String decodeBase64Token(String encodedString) {


        return URLDecoder.decode(encodedString, StandardCharsets.UTF_8);
    }
}

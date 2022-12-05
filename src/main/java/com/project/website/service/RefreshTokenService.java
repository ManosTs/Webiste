package com.project.website.service;

import com.project.website.entity.RefreshToken;
import com.project.website.entity.User;
import com.project.website.repository.RefreshTokenRepository;
import com.project.website.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import net.bytebuddy.implementation.bytecode.Throw;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.MessageHandlingException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public void setRefreshTokenRepository(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Value("${jwt.refresh.token.expiration}")
    private long REFRESH_TOKEN_VALIDITY;

    public RefreshToken createRefreshToken(String userID){
        User user = userRepository.findUserById(userID);
        RefreshToken refreshToken = new RefreshToken();
        try {


            refreshToken.setToken(generateBased64());
            refreshToken.setUser(user);
            refreshToken.setExpireDate(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY * 1000));
            return refreshTokenRepository.save(refreshToken);
        }catch (DataIntegrityViolationException e) {
            System.out.println("DUPLICATE REFRESH TOKEN ENTRY");
        }


        return refreshToken;
    }

    private String generateBased64(){
        return UUID.randomUUID().toString().replace("-", "");
    }

    public boolean validateRefreshToken(RefreshToken refreshToken){
        if(refreshToken.getExpireDate().compareTo(new Date()) < 0){
            refreshTokenRepository.deleteRefreshTokenByToken(refreshToken.getToken());
            return true;
        }
        return false;
    }
}

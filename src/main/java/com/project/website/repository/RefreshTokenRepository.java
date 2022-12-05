package com.project.website.repository;

import com.project.website.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    RefreshToken findRefreshTokenByToken(String token);

    //execute delete operation
    @Modifying
    void deleteRefreshTokenByToken(String token);
}

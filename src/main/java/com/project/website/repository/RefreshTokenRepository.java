package com.project.website.repository;

import com.project.website.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    RefreshToken findRefreshTokenByToken(String token);

    @Query("SELECT u FROM RefreshToken u WHERE u.user.id = :id")
    RefreshToken findRefreshTokenByUserId(String id);
    //execute delete operation
    @Modifying
    void deleteRefreshTokenByToken(String token);
}

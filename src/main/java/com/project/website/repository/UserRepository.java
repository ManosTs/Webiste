package com.project.website.repository;

import com.project.website.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);

    User findUserById(String id);

    Page < User > findAll(Pageable pageable);
}

package com.project.website.repository;

import com.project.website.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, String> {
    User findByIdAnd(String id);
}

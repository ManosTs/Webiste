package com.project.website.repository;


import com.project.website.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
    Role findRoleByName(String name);
}

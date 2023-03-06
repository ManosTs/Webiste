package com.project.website.repository;

import com.project.website.entity.Friend;
import com.project.website.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendRepository extends JpaRepository<Friend, String> {

    Friend findByFriendId(String id);
}

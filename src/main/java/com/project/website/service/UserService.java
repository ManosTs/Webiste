package com.project.website.service;

import com.project.website.entity.User;
import com.project.website.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private UserRepository userRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public void setbCryptPasswordEncoder(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String email, String username, String password){
        User newUser = new User();

        String encodedPassword = bCryptPasswordEncoder.encode(password);

        newUser.setEmail(email);
        newUser.setUsername(username);
        newUser.setPassword(encodedPassword);

        userRepository.save(newUser);

        return newUser;
    }

    public User authUser(String email, String password){
        User userExists = userRepository.findByEmail(email);

        if(userExists != null && bCryptPasswordEncoder.matches(password, userExists.getPassword())){
            return userExists;
        }

        return null;
    }
}

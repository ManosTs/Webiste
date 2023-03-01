package com.project.website.service;

import com.project.website.config.JwtTokenUtil;
import com.project.website.entity.Role;
import com.project.website.entity.User;
import com.project.website.repository.RoleRepository;
import com.project.website.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    private UserRepository userRepository;

    private RoleRepository roleRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    public void setJwtTokenUtil(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }
    @Autowired
    public void setbCryptPasswordEncoder(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public User createUser(User user){
        User userFound = userRepository.findByEmail(user.getEmail());
        if(userFound != null){
            return null; //user exists
        }

        User newUser = new User(); //create new user

        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword()); //encode code

        Role role = roleRepository.findRoleByName("ROLE_USER"); //add role to the user

        //save user
        newUser.setEmail(user.getEmail());
        newUser.setUsername(user.getUsername());
        newUser.setPassword(encodedPassword);
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setBirthDate(user.getBirthDate());
        newUser.setGender(user.getGender());
        newUser.addRole(role);

        return userRepository.save(newUser);
    }

    public User authUser(String email, String password){
        User userExists = userRepository.findByEmail(email);

        if(userExists != null && bCryptPasswordEncoder.matches(password, userExists.getPassword())){

            return userExists;
        }

        return null;
    }

    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email);
    }


    public Page<User> findUsersPaginated(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        return this.userRepository.findAll(pageable);
    }

    public Map<?, ?> userDetails(String id){
        Map<String, String> details = new HashMap<>();

        User user = userRepository.findUserById(id);

        details.put("id", user.getId());
        details.put("username", user.getUsername());
        details.put("email", user.getEmail());
        details.put("roles", user.getRoles().toString());
        details.put("access_token", user.getAccessToken());

        return details;
    }
}

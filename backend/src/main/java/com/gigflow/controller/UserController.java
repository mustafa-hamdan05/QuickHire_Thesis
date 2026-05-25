package com.gigflow.controller;

import com.gigflow.model.*;
import com.gigflow.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository users;
    public UserController(UserRepository users) { this.users = users; }

    @GetMapping("/me")
    public User me(@AuthenticationPrincipal User user) { user.setPassword(null); return user; }

    @GetMapping("/freelancers")
    public List<User> freelancers() {
        return users.findByRole(Role.FREELANCER).stream().peek(u -> u.setPassword(null)).toList();
    }

    @PutMapping("/me")
    public User update(@AuthenticationPrincipal User current, @RequestBody User data) {
        current.setName(data.getName()); current.setBio(data.getBio()); current.setSkills(data.getSkills());
        current.setAvailability(data.getAvailability()); current.setLocation(data.getLocation());
        users.save(current); current.setPassword(null); return current;
    }
}

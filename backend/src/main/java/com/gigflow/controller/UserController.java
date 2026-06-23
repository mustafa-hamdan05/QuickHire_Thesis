package com.gigflow.controller;

import com.gigflow.model.Role;
import com.gigflow.model.User;
import com.gigflow.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "https://quickhire-thesis.vercel.app"})
public class UserController {

    private final UserRepository users;

    public UserController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/freelancers")
    public List<User> freelancers() {
        return users.findAll().stream()
                .filter(u -> u.getRole() == Role.FREELANCER)
                .collect(Collectors.toList());
    }
}
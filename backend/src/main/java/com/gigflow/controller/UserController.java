package com.gigflow.controller;

import com.gigflow.model.Role;
import com.gigflow.model.User;
import com.gigflow.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    // Update a user's profile fields (bio, skills, availability, location)
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User u = users.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (body.containsKey("bio")) u.setBio(body.get("bio"));
        if (body.containsKey("skills")) u.setSkills(body.get("skills"));
        if (body.containsKey("availability")) u.setAvailability(body.get("availability"));
        if (body.containsKey("location")) u.setLocation(body.get("location"));
        return users.save(u);
    }
}
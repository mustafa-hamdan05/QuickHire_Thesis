package com.gigflow.controller;

import com.gigflow.config.JwtService;
import com.gigflow.dto.*;
import com.gigflow.model.*;
import com.gigflow.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req) {
        if (users.findByEmail(req.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(encoder.encode(req.password()))
                .role(Role.valueOf(req.role().toUpperCase()))
                .bio("New QuickHire member")
                .skills("Communication, Time Management")
                .availability("Available")
                .location("Budapest")
                .rating(4.7)
                .build();

        users.save(user);

        user.setPassword(null);

        return new AuthResponse(jwt.generateToken(user.getEmail()), user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest req) {
        User user = users.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Invalid login details"));

        if (!encoder.matches(req.password(), user.getPassword())) {
            throw new RuntimeException("Invalid login details");
        }

        String token = jwt.generateToken(user.getEmail());

        user.setPassword(null);

        return new AuthResponse(token, user);
    }
}
package com.gigflow.dto;
import com.gigflow.model.User;
public record AuthResponse(String token, User user) {}

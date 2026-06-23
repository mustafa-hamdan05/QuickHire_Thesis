package com.gigflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @JsonIgnore               // never expose the password hash in any JSON response
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(length = 1000)
    private String bio;

    private String skills;
    private String availability;
    private String location;
    private Double rating;
}
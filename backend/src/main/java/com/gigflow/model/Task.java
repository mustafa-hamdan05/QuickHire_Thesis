package com.gigflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1500)
    private String description;
    private String category;
    private String requiredSkills;
    private String location;
    private Double hourlyRate;
    private String status;
    private LocalDateTime createdAt;
    @ManyToOne
    private User client;
}

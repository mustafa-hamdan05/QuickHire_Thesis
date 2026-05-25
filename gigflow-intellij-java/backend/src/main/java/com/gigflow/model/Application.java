package com.gigflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;



@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Entity
public class Application {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Task task;
    @ManyToOne private User freelancer;
    @Column(length = 1000)
    private String message;
    private String status;
    private LocalDateTime createdAt;
}

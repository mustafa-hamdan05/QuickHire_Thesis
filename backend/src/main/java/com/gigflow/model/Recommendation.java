package com.gigflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Recommendation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Task task;            // the recommended gig (real relation to your Task table)

    private String freelancerName; // who it was generated for

    private Integer score;         // 0-100 match score

    @Column(length = 500)
    private String reason;         // human-readable explanation

    private LocalDateTime createdAt;
}

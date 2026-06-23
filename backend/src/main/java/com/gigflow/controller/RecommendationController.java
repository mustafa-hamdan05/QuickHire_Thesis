package com.gigflow.controller;

import com.gigflow.model.Recommendation;
import com.gigflow.repository.RecommendationRepository;
import com.gigflow.repository.TaskRepository;
import com.gigflow.service.MatchingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = {"http://localhost:5173", "https://quickhire-thesis.vercel.app"})
public class RecommendationController {

    private final RecommendationRepository recommendations;
    private final TaskRepository tasks;
    private final MatchingService matching;

    public RecommendationController(RecommendationRepository recommendations,
                                    TaskRepository tasks,
                                    MatchingService matching) {
        this.recommendations = recommendations;
        this.tasks = tasks;
        this.matching = matching;
    }

    // View all saved recommendations (handy for the H2 console / demo proof)
    @GetMapping
    public List<Recommendation> all() {
        return recommendations.findAll();
    }

    // Generate fresh matches for a freelancer, save the top 5, and return them.
    // Body: { "freelancerName": "...", "skills": "React, CSS", "location": "Budapest" }
    @PostMapping("/generate")
    public List<Recommendation> generate(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("freelancerName", "Guest");
        String skills = body.getOrDefault("skills", "");
        String location = body.getOrDefault("location", "");

        List<Recommendation> scored = matching.generate(name, skills, location, tasks.findAll());
        List<Recommendation> top = scored.stream().limit(5).collect(Collectors.toList());
        return recommendations.saveAll(top);
    }
}

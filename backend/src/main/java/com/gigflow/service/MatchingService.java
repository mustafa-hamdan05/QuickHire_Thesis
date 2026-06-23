package com.gigflow.service;

import com.gigflow.model.Recommendation;
import com.gigflow.model.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Rule-based gig matching engine (the "AI").
 * Scores each task against a freelancer's skills + location. No external services.
 */
@Service
public class MatchingService {

    public List<Recommendation> generate(String name, String skillsCsv, String location, List<Task> tasks) {
        Set<String> freelancerSkills = toSet(skillsCsv);
        List<Recommendation> results = new ArrayList<>();

        for (Task task : tasks) {
            Set<String> required = toSet(task.getRequiredSkills());

            int score;
            int matched = 0;

            // Main signal: how many required skills the freelancer has (up to 70 pts)
            if (!required.isEmpty()) {
                for (String s : required) {
                    if (freelancerSkills.contains(s)) matched++;
                }
                score = (int) Math.round(70.0 * matched / required.size());
            } else {
                score = 35; // no listed requirements -> neutral base
            }

            // Location signal (up to 15 pts)
            String loc = task.getLocation() == null ? "" : task.getLocation();
            if (location != null && !location.isBlank() && loc.equalsIgnoreCase(location)) {
                score += 15;
            } else if (loc.equalsIgnoreCase("Remote")) {
                score += 10;
            }

            // Keyword signal: a skill appears in the title/description/category (15 pts)
            String haystack = (safe(task.getTitle()) + " " + safe(task.getDescription())
                    + " " + safe(task.getCategory())).toLowerCase();
            boolean keywordHit = freelancerSkills.stream()
                    .anyMatch(s -> !s.isEmpty() && haystack.contains(s));
            if (keywordHit) score += 15;

            score = Math.max(0, Math.min(100, score));

            // Human-readable reason
            String reason;
            if (!required.isEmpty()) {
                reason = "Matches " + matched + " of " + required.size() + " required skills";
            } else {
                reason = "Open to your skill set";
            }
            if (loc.equalsIgnoreCase("Remote")) {
                reason += " \u00B7 Remote-friendly";
            } else if (location != null && !location.isBlank() && loc.equalsIgnoreCase(location)) {
                reason += " \u00B7 In " + loc;
            }

            results.add(Recommendation.builder()
                    .task(task)
                    .freelancerName(name)
                    .score(score)
                    .reason(reason)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        results.sort((a, b) -> b.getScore() - a.getScore());
        return results;
    }

    private Set<String> toSet(String csv) {
        Set<String> set = new HashSet<>();
        if (csv == null) return set;
        for (String part : csv.split(",")) {
            String v = part.trim().toLowerCase();
            if (!v.isEmpty()) set.add(v);
        }
        return set;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}

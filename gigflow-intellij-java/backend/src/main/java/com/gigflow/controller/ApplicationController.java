package com.gigflow.controller;

import com.gigflow.model.*;
import com.gigflow.repository.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationRepository apps; private final TaskRepository tasks;
    public ApplicationController(ApplicationRepository apps, TaskRepository tasks) { this.apps = apps; this.tasks = tasks; }

    @GetMapping public List<Application> all(@AuthenticationPrincipal User user) {
        if (user.getRole() == Role.CLIENT) return apps.findByTaskClientId(user.getId());
        return apps.findByFreelancerId(user.getId());
    }

    @PostMapping("/{taskId}")
    public Application apply(@AuthenticationPrincipal User user, @PathVariable Long taskId, @RequestBody Map<String,String> body) {
        Task task = tasks.findById(taskId).orElseThrow();
        Application app = Application.builder().task(task).freelancer(user).message(body.getOrDefault("message", "I am interested in this gig."))
            .status("pending").createdAt(LocalDateTime.now()).build();
        return apps.save(app);
    }

    @PatchMapping("/{id}")
    public Application update(@PathVariable Long id, @RequestBody Map<String,String> body) {
        Application app = apps.findById(id).orElseThrow(); app.setStatus(body.getOrDefault("status", app.getStatus())); return apps.save(app);
    }
}

package com.gigflow.controller;

import com.gigflow.model.Application;
import com.gigflow.model.Task;
import com.gigflow.model.User;
import com.gigflow.repository.ApplicationRepository;
import com.gigflow.repository.TaskRepository;
import com.gigflow.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173", "https://quickhire-thesis.vercel.app"})
public class ApplicationController {

    private final ApplicationRepository applications;
    private final TaskRepository tasks;
    private final UserRepository users;

    public ApplicationController(ApplicationRepository applications, TaskRepository tasks, UserRepository users) {
        this.applications = applications;
        this.tasks = tasks;
        this.users = users;
    }

    @GetMapping
    public List<Application> all() {
        return applications.findAll();
    }

    // Body: { "taskId": 3, "freelancerEmail": "sara@quickhire.com", "message": "..." }
    @PostMapping
    public Application create(@RequestBody Map<String, String> body) {
        Long taskId = Long.valueOf(body.get("taskId"));
        Task task = tasks.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        User freelancer = users.findByEmail(body.getOrDefault("freelancerEmail", "")).orElse(null);

        Application app = Application.builder()
                .task(task)
                .freelancer(freelancer)
                .message(body.getOrDefault("message", "I am interested in this opportunity."))
                .status("pending")
                .createdAt(LocalDateTime.now())
                .build();

        return applications.save(app);
    }

    // Body: { "status": "accepted" }
    @PutMapping("/{id}")
    public Application updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Application app = applications.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(body.getOrDefault("status", app.getStatus()));
        return applications.save(app);
    }
}
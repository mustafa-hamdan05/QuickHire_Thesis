package com.gigflow.controller;

import com.gigflow.model.Task;
import com.gigflow.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskRepository tasks;

    public TaskController(TaskRepository tasks) {
        this.tasks = tasks;
    }

    @GetMapping
    public List<Task> all() {
        return tasks.findAll();
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        return tasks.save(task);
    }

    @GetMapping("/{id}")
    public Task one(@PathVariable Long id) {
        return tasks.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tasks.deleteById(id);
    }
}
package com.gigflow.config;

import com.gigflow.model.*;
import com.gigflow.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository users;
    private final TaskRepository tasks;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository users, TaskRepository tasks, PasswordEncoder encoder) {
        this.users = users;
        this.tasks = tasks;
        this.encoder = encoder;
    }

    public void run(String... args) {
        if (tasks.count() >= 13) return;

        User client;

        if (users.findByEmail("client@gigflow.com").isPresent()) {
            client = users.findByEmail("client@gigflow.com").get();
        } else {
            client = users.save(User.builder()
                    .name("Demo Client")
                    .email("client@gigflow.com")
                    .password(encoder.encode("123456"))
                    .role(Role.CLIENT)
                    .bio("Hiring manager")
                    .location("Budapest")
                    .rating(4.8)
                    .build());
        }

        if (users.findByEmail("sara@gigflow.com").isEmpty()) {
            users.save(User.builder()
                    .name("Sara Developer")
                    .email("sara@gigflow.com")
                    .password(encoder.encode("123456"))
                    .role(Role.FREELANCER)
                    .bio("Frontend freelancer")
                    .skills("React, JavaScript, CSS")
                    .availability("Available today")
                    .location("Budapest")
                    .rating(4.9)
                    .build());
        }

        if (users.findByEmail("omar@gigflow.com").isEmpty()) {
            users.save(User.builder()
                    .name("Omar Designer")
                    .email("omar@gigflow.com")
                    .password(encoder.encode("123456"))
                    .role(Role.FREELANCER)
                    .bio("UI/UX and branding specialist")
                    .skills("Figma, UI Design, Branding")
                    .availability("Available this week")
                    .location("Debrecen")
                    .rating(4.7)
                    .build());
        }

        if (tasks.count() > 0) return;

        addTask("Frontend Website Assistant", "Help build a landing page and dashboard UI.", "Web Development", "React, CSS", "Budapest", 22.0, client);
        addTask("Event Registration Support", "Support check-in desk for a business event.", "Event Staff", "Communication, Organization", "Budapest", 18.0, client);
        addTask("Mobile App Tester", "Test Android app screens and report bugs clearly.", "Testing", "Android, QA, Bug Reports", "Debrecen", 16.0, client);
        addTask("Logo and Branding Designer", "Create a simple brand identity for a small business.", "Design", "Figma, Branding, Illustrator", "Szeged", 24.0, client);
        addTask("Social Media Content Creator", "Prepare weekly posts for Instagram and TikTok.", "Marketing", "Canva, Copywriting, Social Media", "Budapest", 20.0, client);
        addTask("Data Entry Assistant", "Organize spreadsheet records and clean customer data.", "Admin", "Excel, Accuracy, Data Entry", "Remote", 14.0, client);
        addTask("Photography Assistant", "Help with lighting, setup, and client coordination.", "Photography", "Camera Setup, Communication", "Pecs", 19.0, client);
        addTask("Restaurant Shift Helper", "Support evening restaurant operations during busy hours.", "Hospitality", "Teamwork, Customer Service", "Budapest", 15.0, client);
        addTask("Backend API Helper", "Assist with Spring Boot REST API testing and documentation.", "Backend Development", "Java, Spring Boot, REST API", "Remote", 26.0, client);
        addTask("Translation Assistant", "Translate short business documents from English to Hungarian.", "Translation", "English, Hungarian, Writing", "Remote", 21.0, client);
        addTask("University Event Promoter", "Promote a student event and help manage attendees.", "Promotion", "Communication, Sales, Events", "Debrecen", 17.0, client);
        addTask("Video Editing Assistant", "Edit short promotional clips for online campaigns.", "Video Editing", "Premiere Pro, CapCut, Creativity", "Remote", 23.0, client);
        addTask("Customer Support Freelancer", "Reply to customer questions and organize support requests.", "Customer Support", "Email, Communication, Problem Solving", "Budapest", 18.0, client);
    }

    private void addTask(String title, String description, String category, String skills, String location, Double rate, User client) {
        tasks.save(Task.builder()
                .title(title)
                .description(description)
                .category(category)
                .requiredSkills(skills)
                .location(location)
                .hourlyRate(rate)
                .status("open")
                .createdAt(LocalDateTime.now())
                .client(client)
                .build());
    }
}
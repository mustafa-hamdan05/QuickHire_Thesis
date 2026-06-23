package com.gigflow.config;

import com.gigflow.model.*;
import com.gigflow.repository.TaskRepository;
import com.gigflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the default client, a few freelancers, and starter gigs on startup
 * (only when missing). This keeps the app populated even after Render wipes
 * the H2 file on a restart/redeploy. Default password for all seeded users: 123456
 */
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

    @Override
    public void run(String... args) {
        User client = users.findByEmail("client@quickhire.com").orElse(null);

        if (client == null) {
            client = users.save(User.builder()
                    .name("QuickHire Talent Hub")
                    .email("client@quickhire.com")
                    .password(encoder.encode("123456"))
                    .role(Role.CLIENT)
                    .bio("Official QuickHire client account.")
                    .skills("")
                    .availability("Available")
                    .location("Budapest")
                    .rating(5.0)
                    .build());

            users.save(freelancer("Sara Ahmed", "sara@quickhire.com",
                    "Frontend developer who builds clean React UIs.", "React, CSS, JavaScript, HTML", "Budapest", 4.9));
            users.save(freelancer("Adam Nagy", "adam@quickhire.com",
                    "Backend assistant for APIs and databases.", "Java, Spring Boot, SQL, APIs", "Budapest", 4.6));
            users.save(freelancer("Leila Omar", "leila@quickhire.com",
                    "UI designer for clean modern interfaces.", "Figma, UI Design, Canva, UX", "Remote", 4.8));
            users.save(freelancer("Daniel Kovacs", "daniel@quickhire.com",
                    "Reliable event and hospitality support.", "Communication, Events, Customer Service", "Debrecen", 4.7));
        }

        if (tasks.count() == 0) {
            final User owner = client;
            List<Task> seed = List.of(
                    task(owner, "Frontend Website Assistant", "Help improve a company landing page using React and CSS.", "Web Development", "React, CSS, HTML", "Budapest", 22.0),
                    task(owner, "Backend API Support", "Assist with REST API testing and small backend fixes.", "Web Development", "Java, Spring Boot, APIs", "Remote", 26.0),
                    task(owner, "Event Registration Staff", "Support check-in and guest registration for a business event.", "Event Staff", "Communication, Organization", "Debrecen", 15.0),
                    task(owner, "Hotel Reception Support", "Part-time reception support for check-ins and guest communication.", "Hospitality", "English, Communication, Hospitality", "Budapest", 19.0),
                    task(owner, "Social Media Assistant", "Create short posts and schedule content for a small business.", "Marketing", "Social Media, Writing, Canva", "Remote", 21.0),
                    task(owner, "UI Design Assistant", "Help redesign dashboard cards and page layouts.", "Design", "UI Design, Figma, UX", "Remote", 24.0),
                    task(owner, "Warehouse Packing Assistant", "Help organize, pack, and label products in a warehouse.", "Logistics", "Warehouse, Packing, Reliability", "Debrecen", 16.0)
            );
            tasks.saveAll(seed);
        }
    }

    private User freelancer(String name, String email, String bio, String skills, String location, double rating) {
        return User.builder()
                .name(name).email(email).password(encoder.encode("123456"))
                .role(Role.FREELANCER).bio(bio).skills(skills)
                .availability("Available").location(location).rating(rating).build();
    }

    private Task task(User client, String title, String desc, String cat, String skills, String loc, double rate) {
        return Task.builder()
                .title(title).description(desc).category(cat).requiredSkills(skills)
                .location(loc).hourlyRate(rate).status("OPEN").createdAt(LocalDateTime.now())
                .client(client).build();
    }
}
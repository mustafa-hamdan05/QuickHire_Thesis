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
 * Seeds the default client, freelancers, and starter gigs on startup (only when missing).
 * Keeps the app populated even after Render wipes the H2 file on a redeploy.
 * Default password for all seeded users: 123456
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

            users.save(freelancer("Sara Ahmed", "sara@quickhire.com", "Frontend developer who builds clean React UIs.", "React, CSS, JavaScript, HTML", "Budapest", 4.9));
            users.save(freelancer("Adam Nagy", "adam@quickhire.com", "Backend assistant for APIs and databases.", "Java, Spring Boot, SQL, APIs", "Budapest", 4.6));
            users.save(freelancer("Leila Omar", "leila@quickhire.com", "UI designer for clean modern interfaces.", "Figma, UI Design, Canva, UX", "Remote", 4.8));
            users.save(freelancer("Daniel Kovacs", "daniel@quickhire.com", "Reliable event and hospitality support.", "Communication, Events, Customer Service", "Debrecen", 4.7));
            users.save(freelancer("Mira Hassan", "mira@quickhire.com", "Online support and admin specialist.", "English, Support, Scheduling, Communication", "Remote", 4.8));
            users.save(freelancer("Karim Youssef", "karim@quickhire.com", "Experienced in catering and hotel guest service.", "Hospitality, Teamwork, Service, English", "Szeged", 4.6));
            users.save(freelancer("Nora Farkas", "nora@quickhire.com", "Helps small businesses with content and promotion.", "Social Media, Writing, Branding, Canva", "Remote", 4.7));
            users.save(freelancer("Bence Toth", "bence@quickhire.com", "Warehouse, delivery, and packing support.", "Warehouse, Packing, Logistics, Reliability", "Debrecen", 4.5));
            users.save(freelancer("Eva Szabo", "eva@quickhire.com", "Graphic designer for posters and social content.", "Design, Canva, Illustrator, Creativity", "Budapest", 4.9));
            users.save(freelancer("Omar Khalil", "omar@quickhire.com", "Full-stack helper for small web projects.", "JavaScript, React, Node, CSS", "Remote", 4.7));
        }

        if (tasks.count() == 0) {
            final User owner = client;
            List<Task> seed = List.of(
                    task(owner, "Frontend Website Assistant", "Help improve a company landing page using React and CSS.", "Web Development", "React, CSS, HTML", "Budapest", 22.0),
                    task(owner, "Backend API Support", "Assist with REST API testing and small backend fixes.", "Web Development", "Java, Spring Boot, APIs", "Remote", 26.0),
                    task(owner, "WordPress Site Builder", "Build and style a small business WordPress site.", "Web Development", "WordPress, PHP, CSS", "Budapest", 23.0),
                    task(owner, "QA Tester", "Manually test web features and report bugs clearly.", "Web Development", "Testing, Attention to Detail, JavaScript", "Remote", 20.0),
                    task(owner, "Event Registration Staff", "Support check-in and guest registration for a business event.", "Event Staff", "Communication, Organization", "Debrecen", 15.0),
                    task(owner, "Conference Assistant", "Help guests, prepare badges, and guide attendees.", "Event Staff", "Events, English, Customer Service", "Budapest", 17.0),
                    task(owner, "Hotel Reception Support", "Part-time reception support for check-ins and guest communication.", "Hospitality", "English, Communication, Hospitality", "Budapest", 19.0),
                    task(owner, "Catering Support Worker", "Assist the catering team with serving and preparation.", "Hospitality", "Hospitality, Teamwork, Service", "Szeged", 14.0),
                    task(owner, "Social Media Assistant", "Create short posts and schedule content for a small business.", "Marketing", "Social Media, Writing, Canva", "Remote", 21.0),
                    task(owner, "Brand Promotion Staff", "Promote a local product at a student event.", "Marketing", "Marketing, Communication, Sales", "Debrecen", 16.0),
                    task(owner, "Email Marketing Assistant", "Write and schedule a small email campaign.", "Marketing", "Email, Copywriting, Mailchimp", "Remote", 19.0),
                    task(owner, "UI Design Assistant", "Help redesign dashboard cards and page layouts.", "Design", "UI Design, Figma, UX", "Remote", 24.0),
                    task(owner, "Poster Designer", "Design a clean promotional poster for an event.", "Design", "Design, Canva, Creativity", "Remote", 18.0),
                    task(owner, "Warehouse Packing Assistant", "Help organize, pack, and label products in a warehouse.", "Logistics", "Warehouse, Packing, Reliability", "Debrecen", 16.0),
                    task(owner, "Delivery Helper", "Assist with local deliveries and package handling.", "Logistics", "Delivery, Time Management", "Budapest", 15.0)
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
package com.gigflow.config;

import com.gigflow.model.Role;
import com.gigflow.model.Task;
import com.gigflow.model.User;
import com.gigflow.repository.TaskRepository;
import com.gigflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository users;
    private final TaskRepository tasks;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository users,
                      TaskRepository tasks,
                      PasswordEncoder encoder) {
        this.users = users;
        this.tasks = tasks;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {

        User client;

        if (users.findByEmail("client@gigflow.com").isPresent()) {
            client = users.findByEmail("client@gigflow.com").get();
        } else {
            User newClient = new User();

            newClient.setName("Demo Client");
            newClient.setEmail("client@gigflow.com");
            newClient.setPassword(encoder.encode("123456"));
            newClient.setRole(Role.CLIENT);
            newClient.setBio("Hiring manager");
            newClient.setLocation("Budapest");
            newClient.setRating(4.8);

            client = users.save(newClient);
        }

        if (tasks.count() == 0) {

            createTask(
                    "Frontend Website Assistant",
                    "Help improve a company landing page using React and CSS.",
                    "Web Development",
                    "React, CSS, HTML",
                    "Budapest",
                    22,
                    client
            );

            createTask(
                    "Event Registration Support",
                    "Assist with guest check-ins and registration tasks.",
                    "Event Staff",
                    "Communication, Organization",
                    "Budapest",
                    18,
                    client
            );

            createTask(
                    "Mobile App Tester",
                    "Test Android application features and report bugs.",
                    "Web Development",
                    "Android, Testing",
                    "Debrecen",
                    20,
                    client
            );

            createTask(
                    "Logo and Branding Designer",
                    "Design logos and social media branding kits.",
                    "Design",
                    "Photoshop, Illustrator",
                    "Szeged",
                    25,
                    client
            );

            createTask(
                    "Social Media Content Creator",
                    "Create Instagram and TikTok promotional content.",
                    "Marketing",
                    "Marketing, Canva",
                    "Budapest",
                    19,
                    client
            );

            createTask(
                    "Data Entry Assistant",
                    "Organize and update spreadsheet information.",
                    "Logistics",
                    "Excel, Attention to detail",
                    "Miskolc",
                    16,
                    client
            );

            createTask(
                    "Photography Assistant",
                    "Assist photographer during event shoots.",
                    "Design",
                    "Photography",
                    "Győr",
                    21,
                    client
            );

            createTask(
                    "Restaurant Shift Helper",
                    "Support restaurant staff during busy hours.",
                    "Hospitality",
                    "Customer Service",
                    "Budapest",
                    17,
                    client
            );

            createTask(
                    "Backend API Helper",
                    "Assist with REST API testing and backend fixes.",
                    "Web Development",
                    "Java, Spring Boot",
                    "Budapest",
                    26,
                    client
            );

            createTask(
                    "Translation Assistant",
                    "Translate short documents between English and Hungarian.",
                    "Marketing",
                    "Translation",
                    "Pécs",
                    20,
                    client
            );

            createTask(
                    "University Event Promoter",
                    "Promote upcoming university events online.",
                    "Marketing",
                    "Marketing",
                    "Budapest",
                    15,
                    client
            );

            createTask(
                    "Video Editing Assistant",
                    "Edit short promotional videos for social media.",
                    "Design",
                    "Premiere Pro, Editing",
                    "Szeged",
                    24,
                    client
            );

            createTask(
                    "Customer Support Freelance",
                    "Respond to customer support tickets remotely.",
                    "Hospitality",
                    "Communication",
                    "Remote",
                    23,
                    client
            );
        }
    }

    private void createTask(String title,
                            String description,
                            String category,
                            String skills,
                            String location,
                            double rate,
                            User client) {

        Task task = new Task();

        task.setTitle(title);
        task.setDescription(description);
        task.setCategory(category);
        task.setRequiredSkills(skills);
        task.setLocation(location);
        task.setHourlyRate(rate);
        task.setStatus("open");
        task.setCreatedAt(java.time.LocalDateTime.now());
        task.setClient(client);

        tasks.save(task);
    }
}
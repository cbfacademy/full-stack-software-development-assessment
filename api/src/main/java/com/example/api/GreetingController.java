package com.example.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class GreetingController {

    // Spring injects the repository here automatically
    private final GreetingRepository greetingRepository;

    public GreetingController(GreetingRepository greetingRepository) {
        this.greetingRepository = greetingRepository;
    }

    @GetMapping("/greeting")
    public Greeting getGreeting() {
        // Find all records in the database, grab the first one, or return a fallback
        return greetingRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    // Fallback in case the database table is completely empty
                    Greeting defaultGreeting = new Greeting("Database connection is working, but no entries were found!");
                    return greetingRepository.save(defaultGreeting);
                });
    }
}
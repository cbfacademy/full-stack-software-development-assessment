INSERT INTO greetings (message)
SELECT 'Hello World from Spring Boot Seed!'
WHERE NOT EXISTS (
    SELECT 1 FROM greetings WHERE message = 'Hello World from Spring Boot Seed!'
);
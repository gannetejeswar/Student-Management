
package com.example.audit;

import java.time.Instant;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class Listener {

    private final AuditRepository repository;

    public Listener(AuditRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(topics = "student-events", groupId = "audit-service")
    public void consume(StudentEvent event) {

        System.out.println("[AUDIT] " + event);

        AuditLog log = new AuditLog();

        log.setEventType(event.eventType());
        log.setStudentId(event.studentId());
        log.setName(event.name());
        log.setEmail(event.email());
        log.setCourse(event.course());
        log.setTimestamp(Instant.now().toString());

        repository.save(log);

        System.out.println("Saved to Elasticsearch");
    }
}
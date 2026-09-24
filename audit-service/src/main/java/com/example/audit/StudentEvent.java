package com.example.audit;

public record StudentEvent(
        String eventType,
        Long studentId,
        String name,
        String email,
        String course
) {}
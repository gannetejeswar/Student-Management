package com.example.audit;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName = "student-audit")
public class AuditLog {

    @Id
    private String id;

    private String eventType;
    private Long studentId;
    private String name;
    private String email;
    private String course;
    private String timestamp;

    public AuditLog() {
    }

    public AuditLog(String eventType, Long studentId, String name,
                    String email, String course, String timestamp) {
        this.eventType = eventType;
        this.studentId = studentId;
        this.name = name;
        this.email = email;
        this.course = course;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
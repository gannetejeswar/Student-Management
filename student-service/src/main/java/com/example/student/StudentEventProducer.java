package com.example.student;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class StudentEventProducer {
 private final KafkaTemplate<String,StudentEvent> template;
 public StudentEventProducer(KafkaTemplate<String,StudentEvent> template){this.template=template;}
 public void publish(Student s,String type){
  template.send("student-events",String.valueOf(s.getId()),
   new StudentEvent(type,s.getId(),s.getName(),s.getEmail(),s.getCourse()));
 }
}

package com.example.notification;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
@Component
public class Listener {
 @KafkaListener(topics="student-events",groupId="notification-service",containerFactory="kafkaListenerContainerFactory")
 public void consume(StudentEvent event){System.out.println("[NOTIFICATION] "+event);}
}

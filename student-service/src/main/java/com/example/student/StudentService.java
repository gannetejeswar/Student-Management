package com.example.student;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {
 private final StudentRepository repo;
 private final StudentEventProducer producer;
 public StudentService(StudentRepository repo,StudentEventProducer producer){this.repo=repo;this.producer=producer;}
 public List<Student> all(){return repo.findAll();}
 public Student one(Long id){return repo.findById(id).orElseThrow(()->new RuntimeException("Student not found: "+id));}
 public Student create(Student s){Student x=repo.save(s);producer.publish(x,"STUDENT_CREATED");return x;}
 public Student update(Long id,Student input){Student x=one(id);x.setName(input.getName());x.setEmail(input.getEmail());x.setCourse(input.getCourse());x=repo.save(x);producer.publish(x,"STUDENT_UPDATED");return x;}
 public void delete(Long id){Student x=one(id);repo.delete(x);producer.publish(x,"STUDENT_DELETED");}
}

package com.example.student;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {
 private final StudentService service;
 private final MinioService minio;
 public StudentController(StudentService service,MinioService minio){this.service=service;this.minio=minio;}

 @GetMapping public Object all(){return service.all();}
 @GetMapping("/{id}") public Student one(@PathVariable Long id){return service.one(id);}
 @PostMapping public Student create(@Valid @RequestBody Student s){return service.create(s);}
 @PutMapping("/{id}") public Student update(@PathVariable Long id,@Valid @RequestBody Student s){return service.update(id,s);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}

 @PostMapping("/{id}/document")
 public Map<String,String> upload(@PathVariable Long id,@RequestParam MultipartFile file)throws Exception{
  service.one(id);
  String object="student-"+id+"/"+file.getOriginalFilename();
  minio.upload(object,file);
  return Map.of("message","uploaded","object",object);
 }
}

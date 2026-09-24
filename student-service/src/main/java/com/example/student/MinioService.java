package com.example.student;
import io.minio.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MinioService {
 private final MinioClient client;
 private final String bucket;
 public MinioService(@Value("${minio.url}") String url,
                     @Value("${minio.access-key}") String access,
                     @Value("${minio.secret-key}") String secret,
                     @Value("${minio.bucket-name}") String bucket){
  this.client=MinioClient.builder().endpoint(url).credentials(access,secret).build();
  this.bucket=bucket;
 }
 public void upload(String objectName,MultipartFile file)throws Exception{
  if(!client.bucketExists(BucketExistsArgs.builder().bucket(bucket).build()))
   client.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
  client.putObject(PutObjectArgs.builder().bucket(bucket).object(objectName)
   .stream(file.getInputStream(),file.getSize(),-1).contentType(file.getContentType()).build());
 }
}

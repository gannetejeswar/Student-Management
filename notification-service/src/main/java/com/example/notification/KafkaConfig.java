package com.example.notification;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.*;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import java.util.*;

@Configuration
public class KafkaConfig {
 @Bean
 ConsumerFactory<String,StudentEvent> consumerFactory(org.springframework.core.env.Environment env){
  Map<String,Object> p=new HashMap<>();
  p.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,env.getProperty("spring.kafka.bootstrap-servers"));
  p.put(ConsumerConfig.GROUP_ID_CONFIG,"notification-service");
  p.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,StringDeserializer.class);
  p.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,JsonDeserializer.class);
  JsonDeserializer<StudentEvent> d=new JsonDeserializer<>(StudentEvent.class);
  d.addTrustedPackages("com.example.notification");
  return new DefaultKafkaConsumerFactory<>(p,new StringDeserializer(),d);
 }
 @Bean
 ConcurrentKafkaListenerContainerFactory<String,StudentEvent> kafkaListenerContainerFactory(ConsumerFactory<String,StudentEvent> cf){
  var f=new ConcurrentKafkaListenerContainerFactory<String,StudentEvent>();f.setConsumerFactory(cf);return f;
 }
}

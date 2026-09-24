package com.example.audit;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditRepository extends ElasticsearchRepository<AuditLog, String> {

}
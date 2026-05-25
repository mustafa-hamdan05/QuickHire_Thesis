package com.gigflow.repository;
import com.gigflow.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByFreelancerId(Long freelancerId);
    List<Application> findByTaskClientId(Long clientId);
}

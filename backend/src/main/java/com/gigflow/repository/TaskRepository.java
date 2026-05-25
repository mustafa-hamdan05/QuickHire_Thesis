package com.gigflow.repository;
import com.gigflow.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByClientId(Long clientId);
}

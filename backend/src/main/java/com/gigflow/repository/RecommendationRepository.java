package com.gigflow.repository;

import com.gigflow.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByFreelancerNameOrderByScoreDesc(String freelancerName);
}

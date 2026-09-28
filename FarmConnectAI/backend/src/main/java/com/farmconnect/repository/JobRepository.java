package com.farmconnect.repository;

import com.farmconnect.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Job> findByStatusOrderByCreatedAtDesc(Job.JobStatus status);
}

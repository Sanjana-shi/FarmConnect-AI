package com.farmconnect.repository;

import com.farmconnect.entity.WorkRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkRelationshipRepository extends JpaRepository<WorkRelationship, Long> {
    Optional<WorkRelationship> findByFarmerIdAndWorkerId(Long farmerId, Long workerId);
    List<WorkRelationship> findByFarmerIdOrderByJobsTogetherDesc(Long farmerId);
    List<WorkRelationship> findByWorkerIdOrderByJobsTogetherDesc(Long workerId);
}

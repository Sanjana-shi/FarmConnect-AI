package com.farmconnect.repository;

import com.farmconnect.entity.WorkforcePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkforcePlanRepository extends JpaRepository<WorkforcePlan, Long> {
    List<WorkforcePlan> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}

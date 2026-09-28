package com.farmconnect.repository;

import com.farmconnect.entity.WorkforceScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkforceScenarioRepository extends JpaRepository<WorkforceScenario, Long> {
    List<WorkforceScenario> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}

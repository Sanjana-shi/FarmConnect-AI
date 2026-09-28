package com.farmconnect.repository;

import com.farmconnect.entity.WorkforcePrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkforcePredictionRepository extends JpaRepository<WorkforcePrediction, Long> {
    List<WorkforcePrediction> findByDistrictIgnoreCaseAndCropTypeIgnoreCase(String district, String cropType);
    Optional<WorkforcePrediction> findFirstByDistrictIgnoreCaseAndCropTypeIgnoreCaseAndWorkTypeIgnoreCaseOrderByCreatedAtDesc(
            String district, String cropType, String workType
    );
}

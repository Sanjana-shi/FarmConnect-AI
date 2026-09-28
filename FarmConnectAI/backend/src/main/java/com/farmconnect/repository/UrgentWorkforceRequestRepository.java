package com.farmconnect.repository;

import com.farmconnect.entity.UrgentWorkforceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrgentWorkforceRequestRepository extends JpaRepository<UrgentWorkforceRequest, Long> {
    List<UrgentWorkforceRequest> findByIsActiveTrueOrderByBroadcastTimeDesc();
    Optional<UrgentWorkforceRequest> findByJobId(Long jobId);
}

package com.farmconnect.repository;

import com.farmconnect.entity.TrustedWorker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrustedWorkerRepository extends JpaRepository<TrustedWorker, Long> {
    List<TrustedWorker> findByFarmerIdOrderByTimesHiredDesc(Long farmerId);
    Optional<TrustedWorker> findByFarmerIdAndWorkerId(Long farmerId, Long workerId);
}

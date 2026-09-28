package com.farmconnect.repository;

import com.farmconnect.entity.WorkCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkCertificateRepository extends JpaRepository<WorkCertificate, Long> {
    List<WorkCertificate> findByWorkerIdOrderByIssuedAtDesc(Long workerId);
    List<WorkCertificate> findByFarmerIdOrderByIssuedAtDesc(Long farmerId);
    Optional<WorkCertificate> findByCertificateNumber(String certificateNumber);
    Optional<WorkCertificate> findByWorkerIdAndJobId(Long workerId, Long jobId);
}

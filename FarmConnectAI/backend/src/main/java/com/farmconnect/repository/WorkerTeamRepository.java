package com.farmconnect.repository;

import com.farmconnect.entity.WorkerTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkerTeamRepository extends JpaRepository<WorkerTeam, Long> {
    List<WorkerTeam> findByLeaderWorkerId(Long leaderWorkerId);
    List<WorkerTeam> findByPreferredDistrictIgnoreCase(String preferredDistrict);
    List<WorkerTeam> findByAvailabilityStatus(WorkerTeam.AvailabilityStatus status);
}

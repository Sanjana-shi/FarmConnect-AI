package com.farmconnect.repository;

import com.farmconnect.entity.WorkerTeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerTeamMemberRepository extends JpaRepository<WorkerTeamMember, Long> {
    List<WorkerTeamMember> findByTeamId(Long teamId);
    List<WorkerTeamMember> findByWorkerId(Long workerId);
    Optional<WorkerTeamMember> findByTeamIdAndWorkerId(Long teamId, Long workerId);
    void deleteByTeamIdAndWorkerId(Long teamId, Long workerId);
}

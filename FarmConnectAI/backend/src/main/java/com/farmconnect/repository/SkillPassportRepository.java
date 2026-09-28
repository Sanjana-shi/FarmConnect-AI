package com.farmconnect.repository;

import com.farmconnect.entity.SkillPassport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SkillPassportRepository extends JpaRepository<SkillPassport, Long> {
    Optional<SkillPassport> findByWorkerId(Long workerId);
}

package com.farmconnect.repository;

import com.farmconnect.entity.AiInsight;
import com.farmconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiInsightRepository extends JpaRepository<AiInsight, Long> {
    List<AiInsight> findByUserIdAndIsDismissedFalseOrderByCreatedAtDesc(Long userId);
    List<AiInsight> findByRoleAndIsDismissedFalseOrderByCreatedAtDesc(User.Role role);
}

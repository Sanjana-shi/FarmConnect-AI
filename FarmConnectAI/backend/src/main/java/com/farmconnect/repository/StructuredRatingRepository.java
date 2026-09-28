package com.farmconnect.repository;

import com.farmconnect.entity.StructuredRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StructuredRatingRepository extends JpaRepository<StructuredRating, Long> {
    List<StructuredRating> findByToUserIdOrderByCreatedAtDesc(Long toUserId);
    Optional<StructuredRating> findByJobIdAndFromUserIdAndToUserId(Long jobId, Long fromUserId, Long toUserId);
}

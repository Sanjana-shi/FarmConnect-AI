package com.farmconnect.repository;

import com.farmconnect.entity.JobMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobMessageRepository extends JpaRepository<JobMessage, Long> {
    List<JobMessage> findByJobIdOrderBySentAtAsc(Long jobId);
    List<JobMessage> findByReceiverUserIdAndIsReadFalse(Long receiverUserId);
}

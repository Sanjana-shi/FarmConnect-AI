package com.farmconnect.repository;

import com.farmconnect.entity.User;
import com.farmconnect.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByUser(User user);
    Optional<Worker> findByUserId(Long userId);

    @Query("SELECT w FROM Worker w JOIN FETCH w.user u WHERE w.availabilityStatus = 'AVAILABLE'")
    List<Worker> findAllAvailable();
}

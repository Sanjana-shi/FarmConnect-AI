package com.farmconnect.repository;

import com.farmconnect.entity.Farmer;
import com.farmconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    Optional<Farmer> findByUser(User user);
    Optional<Farmer> findByUserId(Long userId);
}

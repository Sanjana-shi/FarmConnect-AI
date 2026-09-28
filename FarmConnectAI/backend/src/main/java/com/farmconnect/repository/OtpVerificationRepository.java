package com.farmconnect.repository;

import com.farmconnect.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    // Find latest active (unverified) OTP record for a mobile number
    Optional<OtpVerification> findTopByMobileNumberAndIsVerifiedFalseOrderByCreatedAtDesc(String mobileNumber);

    // Find any latest OTP record (verified or unverified) to check cooldown against createdAt
    Optional<OtpVerification> findTopByMobileNumberOrderByCreatedAtDesc(String mobileNumber);

    // Invalidate previous active OTPs for the mobile number
    @Modifying
    @Query("UPDATE OtpVerification o SET o.isVerified = true WHERE o.mobileNumber = :mobileNumber AND o.isVerified = false")
    void invalidatePreviousOtps(@Param("mobileNumber") String mobileNumber);
}

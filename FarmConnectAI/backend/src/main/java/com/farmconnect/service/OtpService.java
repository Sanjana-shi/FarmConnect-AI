package com.farmconnect.service;

import com.farmconnect.entity.OtpVerification;
import com.farmconnect.repository.OtpVerificationRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final SmsService smsService;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern INDIAN_MOBILE_PATTERN = Pattern.compile("^\\+91[6-9]\\d{9}$");
    private static final Pattern SIX_DIGIT_PATTERN = Pattern.compile("^\\d{6}$");
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.otp.expiry-minutes:5}")
    private int expiryMinutes;

    @Value("${app.otp.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.otp.cooldown-seconds:45}")
    private int cooldownSeconds;

    public enum OtpStatus {
        SUCCESS,
        INVALID_PHONE,
        COOLDOWN_ACTIVE,
        SMS_FAILED,
        EXPIRED,
        TOO_MANY_ATTEMPTS,
        INVALID_CODE,
        NOT_FOUND
    }

    @Getter
    public static class OtpResult {
        private final OtpStatus status;
        private final String message;
        private final int remainingAttempts;
        private final int cooldownSecondsRemaining;

        public OtpResult(OtpStatus status, String message) {
            this(status, message, 0, 0);
        }

        public OtpResult(OtpStatus status, String message, int remainingAttempts, int cooldownSecondsRemaining) {
            this.status = status;
            this.message = message;
            this.remainingAttempts = remainingAttempts;
            this.cooldownSecondsRemaining = cooldownSecondsRemaining;
        }

        public boolean isSuccess() {
            return status == OtpStatus.SUCCESS;
        }
    }

    /**
     * Normalizes and validates Indian mobile numbers to standard format +91XXXXXXXXXX.
     */
    public String normalizeIndianMobile(String rawMobile) {
        if (rawMobile == null) {
            return null;
        }
        // Remove spaces, hyphens, parentheses, and dots
        String cleaned = rawMobile.replaceAll("[\\s\\-\\(\\)\\.]", "");

        if (cleaned.startsWith("+91")) {
            // Already starts with +91
        } else if (cleaned.startsWith("91") && cleaned.length() == 12) {
            cleaned = "+" + cleaned;
        } else if (cleaned.startsWith("0") && cleaned.length() == 11) {
            cleaned = "+91" + cleaned.substring(1);
        } else if (cleaned.length() == 10) {
            cleaned = "+91" + cleaned;
        }

        if (INDIAN_MOBILE_PATTERN.matcher(cleaned).matches()) {
            return cleaned;
        }
        return null;
    }

    /**
     * Generates and dispatches a cryptographically secure 6-digit OTP via SMS.
     * The raw OTP is hashed before persistence to MySQL.
     */
    @Transactional
    public OtpResult sendOtp(String rawMobile) {
        String normalizedMobile = normalizeIndianMobile(rawMobile);
        if (normalizedMobile == null) {
            return new OtpResult(OtpStatus.INVALID_PHONE, "Invalid Indian mobile number. Please enter a valid 10-digit mobile number.");
        }

        // 1. Check rate limit / resend cooldown
        Optional<OtpVerification> lastOtpOpt = otpRepository.findTopByMobileNumberOrderByCreatedAtDesc(normalizedMobile);
        if (lastOtpOpt.isPresent() && lastOtpOpt.get().getCreatedAt() != null) {
            long secondsSinceLast = Duration.between(lastOtpOpt.get().getCreatedAt(), LocalDateTime.now()).getSeconds();
            if (secondsSinceLast < cooldownSeconds) {
                int remaining = (int) (cooldownSeconds - secondsSinceLast);
                return new OtpResult(
                        OtpStatus.COOLDOWN_ACTIVE,
                        "Please wait " + remaining + " seconds before requesting another OTP.",
                        0,
                        remaining
                );
            }
        }

        // 2. Invalidate previous active unverified OTPs for this mobile
        otpRepository.invalidatePreviousOtps(normalizedMobile);

        // 3. Generate cryptographically secure 6-digit OTP
        int randomCode = 100000 + secureRandom.nextInt(900000);
        String rawOtp = String.valueOf(randomCode);

        // 4. Hash the OTP using BCryptPasswordEncoder
        String otpHash = passwordEncoder.encode(rawOtp);

        // 5. Persist hashed OTP to database
        OtpVerification otpEntity = OtpVerification.builder()
                .mobileNumber(normalizedMobile)
                .otpHash(otpHash)
                .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
                .isVerified(false)
                .attempts(0)
                .build();

        otpRepository.save(otpEntity);

        // 6. Send real SMS via SMS Provider
        boolean smsDispatched = smsService.sendOtpSms(normalizedMobile, rawOtp);
        if (!smsDispatched) {
            return new OtpResult(OtpStatus.SMS_FAILED, "Failed to send SMS to " + normalizedMobile + ". Please try again later.");
        }

        return new OtpResult(
                OtpStatus.SUCCESS,
                "OTP sent successfully to " + normalizedMobile,
                maxAttempts,
                cooldownSeconds
        );
    }

    /**
     * Validates the submitted OTP against the stored secure hash.
     * Enforces expiry, single-use, and attempt limiting.
     */
    @Transactional
    public OtpResult verifyOtp(String rawMobile, String submittedOtp) {
        String normalizedMobile = normalizeIndianMobile(rawMobile);
        if (normalizedMobile == null) {
            return new OtpResult(OtpStatus.INVALID_PHONE, "Invalid mobile number format.");
        }

        if (submittedOtp == null || !SIX_DIGIT_PATTERN.matcher(submittedOtp.trim()).matches()) {
            return new OtpResult(OtpStatus.INVALID_CODE, "OTP must be a 6-digit numeric code.");
        }

        Optional<OtpVerification> activeOtpOpt = otpRepository
                .findTopByMobileNumberAndIsVerifiedFalseOrderByCreatedAtDesc(normalizedMobile);

        if (activeOtpOpt.isEmpty()) {
            return new OtpResult(OtpStatus.NOT_FOUND, "No active OTP request found. Please request a new OTP.");
        }

        OtpVerification activeOtp = activeOtpOpt.get();

        // Check expiry
        if (LocalDateTime.now().isAfter(activeOtp.getExpiresAt())) {
            activeOtp.setIsVerified(true); // Invalidate expired OTP
            otpRepository.save(activeOtp);
            return new OtpResult(OtpStatus.EXPIRED, "OTP has expired. Please request a new OTP.");
        }

        // Check attempts lockout
        if (activeOtp.getAttempts() >= maxAttempts) {
            activeOtp.setIsVerified(true); // Lockout this OTP
            otpRepository.save(activeOtp);
            return new OtpResult(OtpStatus.TOO_MANY_ATTEMPTS, "Maximum verification attempts exceeded. Please request a new OTP.");
        }

        // Check match against BCrypt hash
        boolean isMatch = passwordEncoder.matches(submittedOtp.trim(), activeOtp.getOtpHash());

        if (!isMatch) {
            int newAttempts = activeOtp.getAttempts() + 1;
            activeOtp.setAttempts(newAttempts);

            int remaining = maxAttempts - newAttempts;
            if (remaining <= 0) {
                activeOtp.setIsVerified(true);
                otpRepository.save(activeOtp);
                return new OtpResult(OtpStatus.TOO_MANY_ATTEMPTS, "Incorrect OTP. Maximum attempts exceeded. Please request a new OTP.", 0, 0);
            }

            otpRepository.save(activeOtp);
            return new OtpResult(OtpStatus.INVALID_CODE, "Invalid OTP code. " + remaining + " attempt(s) remaining.", remaining, 0);
        }

        // Successfully verified: mark as verified and single-use
        activeOtp.setIsVerified(true);
        otpRepository.save(activeOtp);

        return new OtpResult(OtpStatus.SUCCESS, "Mobile number verified successfully.");
    }
}

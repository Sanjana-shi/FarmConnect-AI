package com.farmconnect.service;

import com.farmconnect.dto.*;
import com.farmconnect.entity.*;
import com.farmconnect.repository.*;
import com.farmconnect.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final WorkerRepository workerRepository;
    private final SkillRepository skillRepository;
    private final OtpService otpService;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public ApiResponse<String> sendOtp(SendOtpRequest request) {
        String cleanMobile = otpService.normalizeIndianMobile(request.getMobileNumber());
        if (cleanMobile == null) {
            return ApiResponse.error("Invalid Indian mobile number format. Must be a valid 10-digit number.");
        }

        OtpService.OtpResult result = otpService.sendOtp(cleanMobile);
        if (!result.isSuccess()) {
            return ApiResponse.error(result.getMessage());
        }

        return ApiResponse.success(result.getMessage(), "OTP dispatched to " + cleanMobile);
    }

    @Transactional
    public ApiResponse<AuthResponse> verifyOtp(VerifyOtpRequest request) {
        String cleanMobile = otpService.normalizeIndianMobile(request.getMobileNumber());
        if (cleanMobile == null) {
            return ApiResponse.error("Invalid Indian mobile number format.");
        }

        OtpService.OtpResult result = otpService.verifyOtp(cleanMobile, request.getOtpCode());
        if (!result.isSuccess()) {
            return ApiResponse.error(result.getMessage());
        }

        // Check if user is already registered in DB
        Optional<User> existingUser = userRepository.findByMobileNumber(cleanMobile);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            String token = jwtTokenProvider.generateToken(user.getMobileNumber(), user.getRole().name(), user.getId());

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .userId(user.getId())
                    .mobileNumber(user.getMobileNumber())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .preferredLanguage(user.getPreferredLanguage())
                    .isRegistered(true)
                    .message("Authentication successful")
                    .build();

            return ApiResponse.success("Login successful", response);
        } else {
            // Unregistered user - requires registration flow
            AuthResponse response = AuthResponse.builder()
                    .mobileNumber(cleanMobile)
                    .isRegistered(false)
                    .message("Mobile verified. Please complete registration.")
                    .build();

            return ApiResponse.success("OTP verified. Please proceed to registration.", response);
        }
    }

    @Transactional
    public ApiResponse<AuthResponse> registerFarmer(RegisterFarmerRequest request) {
        String cleanMobile = otpService.normalizeIndianMobile(request.getMobileNumber());
        if (cleanMobile == null) {
            return ApiResponse.error("Invalid mobile number format.");
        }

        if (userRepository.existsByMobileNumber(cleanMobile)) {
            return ApiResponse.error("A user with this mobile number is already registered.");
        }

        User user = User.builder()
                .mobileNumber(cleanMobile)
                .fullName(request.getFullName())
                .role(User.Role.FARMER)
                .preferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "en")
                .villageOrTown(request.getVillageOrTown())
                .district(request.getDistrict())
                .state(request.getState())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isVerified(true)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        String cropsJson = request.getMainCrops() != null ? String.join(", ", request.getMainCrops()) : "Paddy";

        Farmer farmer = Farmer.builder()
                .user(user)
                .farmSizeAcres(request.getFarmSizeAcres())
                .mainCrops(cropsJson)
                .farmAddress(request.getFarmAddress())
                .build();

        farmerRepository.save(farmer);

        String token = jwtTokenProvider.generateToken(user.getMobileNumber(), user.getRole().name(), user.getId());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .mobileNumber(user.getMobileNumber())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .preferredLanguage(user.getPreferredLanguage())
                .isRegistered(true)
                .message("Farmer account registered successfully")
                .build();

        return ApiResponse.success("Farmer registration complete", response);
    }

    @Transactional
    public ApiResponse<AuthResponse> registerWorker(RegisterWorkerRequest request) {
        String cleanMobile = otpService.normalizeIndianMobile(request.getMobileNumber());
        if (cleanMobile == null) {
            return ApiResponse.error("Invalid mobile number format.");
        }

        if (userRepository.existsByMobileNumber(cleanMobile)) {
            return ApiResponse.error("A user with this mobile number is already registered.");
        }

        User user = User.builder()
                .mobileNumber(cleanMobile)
                .fullName(request.getFullName())
                .role(User.Role.WORKER)
                .preferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "en")
                .villageOrTown(request.getVillageOrTown())
                .district(request.getDistrict())
                .state(request.getState())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isVerified(true)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Fetch skills
        Set<Skill> skillEntities = new HashSet<>();
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            List<Skill> found = skillRepository.findByNameIn(request.getSkills());
            skillEntities.addAll(found);
        }

        Worker.Availability availability = Worker.Availability.AVAILABLE;
        if (request.getAvailabilityStatus() != null) {
            try {
                availability = Worker.Availability.valueOf(request.getAvailabilityStatus().toUpperCase());
            } catch (Exception ignored) {}
        }

        Worker worker = Worker.builder()
                .user(user)
                .experienceYears(request.getExperienceYears())
                .availabilityStatus(availability)
                .availableFromDate(request.getAvailableFromDate())
                .skills(skillEntities)
                .build();

        workerRepository.save(worker);

        String token = jwtTokenProvider.generateToken(user.getMobileNumber(), user.getRole().name(), user.getId());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .mobileNumber(user.getMobileNumber())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .preferredLanguage(user.getPreferredLanguage())
                .isRegistered(true)
                .message("Worker account registered successfully")
                .build();

        return ApiResponse.success("Worker registration complete", response);
    }
}

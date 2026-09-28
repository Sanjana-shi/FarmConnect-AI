package com.farmconnect.service;

import com.farmconnect.dto.FarmerDashboardDto;
import com.farmconnect.dto.JobDto;
import com.farmconnect.entity.Farmer;
import com.farmconnect.entity.Job;
import com.farmconnect.entity.User;
import com.farmconnect.repository.FarmerRepository;
import com.farmconnect.repository.JobRepository;
import com.farmconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmerService {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final JobRepository jobRepository;

    @Transactional(readOnly = true)
    public FarmerDashboardDto getDashboard(String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found: " + mobileNumber));

        Farmer farmer = farmerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user: " + user.getId()));

        List<Job> jobs = jobRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId());

        List<JobDto> activeJobDtos = jobs.stream()
                .filter(j -> j.getStatus() == Job.JobStatus.OPEN || j.getStatus() == Job.JobStatus.IN_PROGRESS)
                .map(this::mapToJobDto)
                .collect(Collectors.toList());

        List<String> crops = farmer.getMainCrops() != null
                ? Arrays.asList(farmer.getMainCrops().split("\\s*,\\s*"))
                : Collections.emptyList();

        int profilePercentage = calculateFarmerProfileCompletion(user, farmer);

        return FarmerDashboardDto.builder()
                .farmerId(farmer.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .villageOrTown(user.getVillageOrTown())
                .district(user.getDistrict())
                .state(user.getState())
                .farmSizeAcres(farmer.getFarmSizeAcres())
                .mainCrops(crops)
                .rating(farmer.getRating())
                .profileCompletionPercentage(profilePercentage)
                .activeJobsCount(activeJobDtos.size())
                .totalApplicationsCount(0)
                .hiredWorkersCount(0)
                .activeJobs(activeJobDtos)
                .build();
    }

    private int calculateFarmerProfileCompletion(User user, Farmer farmer) {
        int score = 40; // Base for user details
        if (farmer.getFarmSizeAcres() != null) score += 20;
        if (farmer.getMainCrops() != null && !farmer.getMainCrops().isBlank()) score += 20;
        if (farmer.getFarmAddress() != null && !farmer.getFarmAddress().isBlank()) score += 10;
        if (user.getLatitude() != null && user.getLongitude() != null) score += 10;
        return Math.min(100, score);
    }

    private JobDto mapToJobDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .farmerId(job.getFarmer().getId())
                .farmerName(job.getFarmer().getUser().getFullName())
                .farmerLocation(job.getFarmer().getUser().getVillageOrTown() + ", " + job.getFarmer().getUser().getDistrict())
                .title(job.getTitle())
                .cropType(job.getCropType())
                .workType(job.getWorkType())
                .description(job.getDescription())
                .workersRequired(job.getWorkersRequired())
                .workersHired(job.getWorkersHired())
                .wageAmount(job.getWageAmount())
                .wageType(job.getWageType().name())
                .currency(job.getCurrency())
                .startDate(job.getStartDate())
                .endDate(job.getEndDate())
                .workingHours(job.getWorkingHours())
                .locationAddress(job.getLocationAddress())
                .foodProvided(job.getFoodProvided())
                .accommodationProvided(job.getAccommodationProvided())
                .status(job.getStatus().name())
                .build();
    }
}

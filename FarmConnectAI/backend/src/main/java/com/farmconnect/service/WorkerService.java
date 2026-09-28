package com.farmconnect.service;

import com.farmconnect.dto.JobDto;
import com.farmconnect.dto.WorkerDashboardDto;
import com.farmconnect.entity.Job;
import com.farmconnect.entity.Skill;
import com.farmconnect.entity.User;
import com.farmconnect.entity.Worker;
import com.farmconnect.repository.JobRepository;
import com.farmconnect.repository.UserRepository;
import com.farmconnect.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final JobRepository jobRepository;

    @Transactional(readOnly = true)
    public WorkerDashboardDto getDashboard(String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new RuntimeException("User not found: " + mobileNumber));

        Worker worker = workerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Worker profile not found for user: " + user.getId()));

        List<String> skillNames = worker.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toList());

        List<Job> openJobs = jobRepository.findByStatusOrderByCreatedAtDesc(Job.JobStatus.OPEN);

        List<JobDto> recommended = openJobs.stream()
                .limit(5)
                .map(this::mapToJobDto)
                .collect(Collectors.toList());

        int profilePercentage = calculateWorkerProfileCompletion(user, worker);

        return WorkerDashboardDto.builder()
                .workerId(worker.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .villageOrTown(user.getVillageOrTown())
                .district(user.getDistrict())
                .state(user.getState())
                .experienceYears(worker.getExperienceYears())
                .availabilityStatus(worker.getAvailabilityStatus().name())
                .rating(worker.getRating())
                .reliabilityScore(worker.getReliabilityScore())
                .completedJobsCount(worker.getCompletedJobsCount())
                .skills(skillNames)
                .profileCompletionPercentage(profilePercentage)
                .activeApplicationsCount(0)
                .activeWorkCount(0)
                .recommendedJobs(recommended)
                .build();
    }

    private int calculateWorkerProfileCompletion(User user, Worker worker) {
        int score = 40;
        if (worker.getSkills() != null && !worker.getSkills().isEmpty()) score += 30;
        if (worker.getExperienceYears() != null) score += 15;
        if (user.getLatitude() != null && user.getLongitude() != null) score += 15;
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

package com.farmconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDashboardDto {
    private Long workerId;
    private Long userId;
    private String fullName;
    private String villageOrTown;
    private String district;
    private String state;
    private Integer experienceYears;
    private String availabilityStatus;
    private BigDecimal rating;
    private Integer reliabilityScore;
    private Integer completedJobsCount;
    private List<String> skills;
    private int profileCompletionPercentage;
    private int activeApplicationsCount;
    private int activeWorkCount;
    private List<JobDto> recommendedJobs;
}

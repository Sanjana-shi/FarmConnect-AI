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
public class FarmerDashboardDto {
    private Long farmerId;
    private Long userId;
    private String fullName;
    private String villageOrTown;
    private String district;
    private String state;
    private BigDecimal farmSizeAcres;
    private List<String> mainCrops;
    private BigDecimal rating;
    private int profileCompletionPercentage;
    private int activeJobsCount;
    private int totalApplicationsCount;
    private int hiredWorkersCount;
    private List<JobDto> activeJobs;
}

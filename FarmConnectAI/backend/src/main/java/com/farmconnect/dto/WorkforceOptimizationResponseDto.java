package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkforceOptimizationResponseDto {
    private String cropType;
    private BigDecimal farmSizeAcres;
    private Integer workersRequired;
    private Integer recommendedWorkersCount;
    private BigDecimal estimatedDurationDays;
    private BigDecimal estimatedTotalCost;
    private String currency;
    private List<OptimizedWorkerDto> recommendedTeam;
    private List<String> planningInsights;
    private String disclaimer;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptimizedWorkerDto {
        private Long workerId;
        private String fullName;
        private Integer matchPercentage;
        private Double distanceKm;
        private Integer reliabilityScore;
        private BigDecimal rating;
        private BigDecimal dailyWage;
        private List<String> explainableReasons;
    }
}

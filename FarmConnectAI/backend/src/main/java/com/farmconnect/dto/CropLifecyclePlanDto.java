package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropLifecyclePlanDto {
    private Long planId;
    private Long farmerId;
    private String planName;
    private String cropType;
    private BigDecimal farmSizeAcres;
    private String farmLocation;
    private String season;
    private BigDecimal estimatedTotalCost;
    private Integer estimatedTotalWorkers;
    private String status;
    private List<LifecycleStageDto> stages;
    private String disclaimer;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LifecycleStageDto {
        private Long stageId;
        private String stageName;
        private Integer workersNeeded;
        private Integer durationDays;
        private String targetMonth;
        private BigDecimal estimatedWageRate;
        private BigDecimal stageCost;
        private String weatherRiskLevel;
        private String suggestedAction;
        private Integer stageOrder;
    }
}

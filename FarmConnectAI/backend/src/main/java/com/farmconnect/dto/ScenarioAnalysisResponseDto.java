package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioAnalysisResponseDto {
    private Long scenarioId;
    private BigDecimal currentPlanCost;
    private BigDecimal alternativePlanCost;
    private BigDecimal costDifference;
    private Integer timeSavedDays;
    private String aiRecommendation;
    private String tradeOffSummary;
    private String disclaimer;
}

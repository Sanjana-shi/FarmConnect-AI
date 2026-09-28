package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScenarioAnalysisRequestDto {
    private Long farmerId;
    private String basePlanTitle;
    private String scenarioTitle;
    private String cropType;
    private BigDecimal farmSizeAcres;
    private Integer currentWorkers;
    private Integer currentDays;
    private BigDecimal currentDailyWage;
    private Integer simulatedWorkers;
    private Integer simulatedDays;
    private BigDecimal simulatedDailyWage;
}

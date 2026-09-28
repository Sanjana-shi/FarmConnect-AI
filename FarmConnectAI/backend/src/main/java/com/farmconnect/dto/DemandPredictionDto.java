package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandPredictionDto {
    private String state;
    private String district;
    private String cropType;
    private String workType;
    private String season;
    private String month;
    private String demandLevel;
    private Integer shortageRiskPercent;
    private String expectedPeakPeriod;
    private String suggestedAction;
    private BigDecimal confidenceScore;
    private List<String> factors;
    private String disclaimer;
}

package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostSimulationRequestDto {
    private String cropType;
    private String workType;
    private BigDecimal farmSizeAcres;
    private Integer numberOfWorkers;
    private Integer durationDays;
    private BigDecimal dailyWage;
    private String wageType;
    private String season;
}

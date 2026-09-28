package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostSimulationResponseDto {
    private Integer workers;
    private Integer durationDays;
    private BigDecimal dailyWage;
    private BigDecimal estimatedTotal;
    private BigDecimal lowerRange;
    private BigDecimal upperRange;
    private String currency;
    private String costBreakdownText;
    private String savingsTip;
}

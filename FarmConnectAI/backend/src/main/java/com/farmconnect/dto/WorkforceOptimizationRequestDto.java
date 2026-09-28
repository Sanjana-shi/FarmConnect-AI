package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkforceOptimizationRequestDto {
    private Long farmerId;
    private String cropType;
    private String workType;
    private BigDecimal farmSizeAcres;
    private BigDecimal targetDurationDays;
    private BigDecimal maxDailyWage;
    private BigDecimal latitude;
    private BigDecimal longitude;
}

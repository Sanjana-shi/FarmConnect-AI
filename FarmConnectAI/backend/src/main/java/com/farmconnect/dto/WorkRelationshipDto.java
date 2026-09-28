package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkRelationshipDto {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private Long workerId;
    private String workerName;
    private Integer jobsTogether;
    private Integer successfulCompletions;
    private BigDecimal averageRating;
    private BigDecimal attendanceRate;
    private Integer reliabilityIndex;
    private LocalDate lastWorkedDate;
}

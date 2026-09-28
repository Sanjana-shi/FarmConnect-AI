package com.farmconnect.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrgentWorkforceDto {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long farmerId;
    private String farmerName;
    private String farmerMobile;
    private String farmLocation;
    private String cropType;
    private String workType;
    private Integer workersNeeded;
    private Double wageAmount;
    private String urgencyLevel;
    private Integer premiumWagePercent;
    private Integer broadcastRadiusKm;
    private String reportedReason;
    private Boolean isActive;
    private LocalDateTime broadcastTime;
    private Double distanceKm;
}

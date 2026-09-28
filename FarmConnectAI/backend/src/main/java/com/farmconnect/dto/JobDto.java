package com.farmconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String farmerLocation;
    private String title;
    private String cropType;
    private String workType;
    private String description;
    private Integer workersRequired;
    private Integer workersHired;
    private BigDecimal wageAmount;
    private String wageType;
    private String currency;
    private LocalDate startDate;
    private LocalDate endDate;
    private String workingHours;
    private String locationAddress;
    private Boolean foodProvided;
    private Boolean accommodationProvided;
    private String status;
    private Double distanceKm;
}

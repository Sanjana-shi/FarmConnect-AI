package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkCertificateDto {
    private Long id;
    private String certificateNumber;
    private Long workerId;
    private String workerName;
    private Long farmerId;
    private String farmerName;
    private Long jobId;
    private String jobTitle;
    private String cropType;
    private String workType;
    private Integer durationDays;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal performanceRating;
    private String performanceGrade;
    private String farmerTestimonial;
    private String farmLocation;
    private String digitalSignatureHash;
    private LocalDateTime issuedAt;
}

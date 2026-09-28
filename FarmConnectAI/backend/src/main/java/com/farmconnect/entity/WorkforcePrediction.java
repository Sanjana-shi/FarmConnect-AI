package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workforce_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkforcePrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "crop_type", nullable = false, length = 100)
    private String cropType;

    @Column(name = "work_type", nullable = false, length = 100)
    private String workType;

    @Column(nullable = false, length = 50)
    private String season;

    @Enumerated(EnumType.STRING)
    @Column(name = "demand_level", nullable = false)
    private DemandLevel demandLevel;

    @Column(name = "shortage_risk_percent", nullable = false)
    private Integer shortageRiskPercent;

    @Column(name = "expected_peak_period", nullable = false, length = 100)
    private String expectedPeakPeriod;

    @Column(name = "suggested_action", nullable = false, columnDefinition = "TEXT")
    private String suggestedAction;

    @Column(name = "confidence_score", precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal confidenceScore = new BigDecimal("0.90");

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum DemandLevel {
        VERY_HIGH,
        HIGH,
        MODERATE,
        LOW
    }
}

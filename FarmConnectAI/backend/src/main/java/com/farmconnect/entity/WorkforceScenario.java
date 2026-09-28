package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "workforce_scenarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkforceScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(name = "base_plan_title", nullable = false, length = 150)
    private String basePlanTitle;

    @Column(name = "scenario_title", nullable = false, length = 150)
    private String scenarioTitle;

    @Column(name = "crop_type", nullable = false, length = 100)
    private String cropType;

    @Column(name = "base_workers", nullable = false)
    private Integer baseWorkers;

    @Column(name = "base_days", nullable = false)
    private Integer baseDays;

    @Column(name = "base_cost", precision = 12, scale = 2, nullable = false)
    private BigDecimal baseCost;

    @Column(name = "simulated_workers", nullable = false)
    private Integer simulatedWorkers;

    @Column(name = "simulated_days", nullable = false)
    private Integer simulatedDays;

    @Column(name = "simulated_cost", precision = 12, scale = 2, nullable = false)
    private BigDecimal simulatedCost;

    @Column(name = "cost_difference", precision = 12, scale = 2, nullable = false)
    private BigDecimal costDifference;

    @Column(name = "time_saved_days", nullable = false)
    private Integer timeSavedDays;

    @Column(name = "ai_recommendation", nullable = false, columnDefinition = "TEXT")
    private String aiRecommendation;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

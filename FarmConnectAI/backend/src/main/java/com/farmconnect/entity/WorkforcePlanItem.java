package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "workforce_plan_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkforcePlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private WorkforcePlan plan;

    @Column(name = "stage_name", nullable = false, length = 100)
    private String stageName;

    @Column(name = "workers_needed", nullable = false)
    private Integer workersNeeded;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "target_month", nullable = false, length = 30)
    private String targetMonth;

    @Column(name = "estimated_wage_rate", precision = 10, scale = 2, nullable = false)
    private BigDecimal estimatedWageRate;

    @Column(name = "stage_cost", precision = 12, scale = 2, nullable = false)
    private BigDecimal stageCost;

    @Enumerated(EnumType.STRING)
    @Column(name = "weather_risk_level")
    @Builder.Default
    private WeatherRiskLevel weatherRiskLevel = WeatherRiskLevel.LOW;

    @Column(name = "suggested_action", columnDefinition = "TEXT")
    private String suggestedAction;

    @Column(name = "stage_order")
    @Builder.Default
    private Integer stageOrder = 1;

    public enum WeatherRiskLevel {
        LOW,
        MODERATE,
        HIGH
    }
}

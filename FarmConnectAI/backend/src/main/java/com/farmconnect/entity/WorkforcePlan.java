package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workforce_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkforcePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(name = "plan_name", nullable = false, length = 150)
    private String planName;

    @Column(name = "crop_type", nullable = false, length = 100)
    private String cropType;

    @Column(name = "farm_size_acres", precision = 6, scale = 2, nullable = false)
    private BigDecimal farmSizeAcres;

    @Column(name = "farm_location", nullable = false, length = 200)
    private String farmLocation;

    @Column(length = 50)
    @Builder.Default
    private String season = "Kharif";

    @Column(name = "estimated_total_cost", precision = 12, scale = 2, nullable = false)
    private BigDecimal estimatedTotalCost;

    @Column(name = "estimated_total_workers", nullable = false)
    private Integer estimatedTotalWorkers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PlanStatus status = PlanStatus.ACTIVE;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkforcePlanItem> stageItems = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PlanStatus {
        DRAFT,
        ACTIVE,
        COMPLETED
    }
}

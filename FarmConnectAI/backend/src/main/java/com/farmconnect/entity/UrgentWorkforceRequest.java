package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "urgent_workforce_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrgentWorkforceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level")
    @Builder.Default
    private UrgencyLevel urgencyLevel = UrgencyLevel.CRITICAL;

    @Column(name = "premium_wage_percent")
    @Builder.Default
    private Integer premiumWagePercent = 15;

    @Column(name = "broadcast_radius_km")
    @Builder.Default
    private Integer broadcastRadiusKm = 25;

    @Column(name = "reported_reason", nullable = false)
    private String reportedReason;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "broadcast_time", updatable = false)
    private LocalDateTime broadcastTime;

    @PrePersist
    protected void onCreate() {
        broadcastTime = LocalDateTime.now();
    }

    public enum UrgencyLevel {
        HIGH,
        CRITICAL,
        EMERGENCY
    }
}

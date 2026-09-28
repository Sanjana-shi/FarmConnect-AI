package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_passports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillPassport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false, unique = true)
    private Worker worker;

    @Column(name = "verified_jobs_count")
    @Builder.Default
    private Integer verifiedJobsCount = 0;

    @Column(name = "attendance_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal attendanceRate = new BigDecimal("95.00");

    @Column(name = "punctuality_score")
    @Builder.Default
    private Integer punctualityScore = 92;

    @Column(name = "work_quality_score")
    @Builder.Default
    private Integer workQualityScore = 94;

    @Column(name = "safety_compliance_score")
    @Builder.Default
    private Integer safetyComplianceScore = 98;

    @Column(name = "machinery_competency_score")
    @Builder.Default
    private Integer machineryCompetencyScore = 85;

    @Column(name = "last_verified_at")
    private LocalDateTime lastVerifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_badge")
    @Builder.Default
    private VerificationBadge verificationBadge = VerificationBadge.PROVEN_WORKER;

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

    public enum VerificationBadge {
        VERIFIED_EXPERT,
        PROVEN_WORKER,
        DEVELOPING
    }
}

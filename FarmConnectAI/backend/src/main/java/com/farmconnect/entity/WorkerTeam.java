package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker_teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_worker_id", nullable = false)
    private Worker leaderWorker;

    @Column(name = "team_name", nullable = false, length = 120)
    private String teamName;

    @Column(name = "primary_skills", nullable = false, columnDefinition = "TEXT")
    private String primarySkills; // e.g. "[\"Paddy Harvesting\", \"Sowing\"]"

    @Column(name = "total_members", nullable = false)
    @Builder.Default
    private Integer totalMembers = 1;

    @Column(name = "team_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal teamRating = new BigDecimal("5.00");

    @Column(name = "completed_team_jobs")
    @Builder.Default
    private Integer completedTeamJobs = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    @Builder.Default
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    @Column(name = "preferred_district", nullable = false, length = 100)
    private String preferredDistrict;

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

    public enum AvailabilityStatus {
        AVAILABLE,
        BUSY,
        PARTIALLY_AVAILABLE
    }
}

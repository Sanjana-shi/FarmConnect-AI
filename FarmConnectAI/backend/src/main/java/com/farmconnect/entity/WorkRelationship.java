package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_relationships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @Column(name = "jobs_together")
    @Builder.Default
    private Integer jobsTogether = 1;

    @Column(name = "successful_completions")
    @Builder.Default
    private Integer successfulCompletions = 1;

    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = new BigDecimal("5.00");

    @Column(name = "attendance_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal attendanceRate = new BigDecimal("100.00");

    @Column(name = "last_worked_date", nullable = false)
    private LocalDate lastWorkedDate;

    @Column(name = "reliability_index")
    @Builder.Default
    private Integer reliabilityIndex = 95;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        updatedAt = LocalDateTime.now();
    }
}

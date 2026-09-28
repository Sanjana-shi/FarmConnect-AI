package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "crop_type", nullable = false, length = 100)
    private String cropType;

    @Column(name = "work_type", nullable = false, length = 100)
    private String workType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "workers_required", nullable = false)
    @Builder.Default
    private Integer workersRequired = 1;

    @Column(name = "workers_hired")
    @Builder.Default
    private Integer workersHired = 0;

    @Column(name = "wage_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal wageAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "wage_type", nullable = false)
    @Builder.Default
    private WageType wageType = WageType.PER_DAY;

    @Column(length = 5)
    @Builder.Default
    private String currency = "INR";

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "working_hours", length = 50)
    @Builder.Default
    private String workingHours = "8:00 AM - 5:00 PM";

    @Column(name = "location_address", columnDefinition = "TEXT", nullable = false)
    private String locationAddress;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "food_provided")
    @Builder.Default
    private Boolean foodProvided = false;

    @Column(name = "accommodation_provided")
    @Builder.Default
    private Boolean accommodationProvided = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

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

    public enum WageType {
        PER_HOUR,
        PER_DAY,
        PER_WEEK,
        PER_JOB,
        PER_ACRE,
        SEASONAL
    }

    public enum JobStatus {
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}

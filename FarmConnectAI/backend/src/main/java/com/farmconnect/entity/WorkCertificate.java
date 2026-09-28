package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 64)
    private String certificateNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "crop_type", nullable = false, length = 100)
    private String cropType;

    @Column(name = "work_type", nullable = false, length = 100)
    private String workType;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "performance_rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal performanceRating;

    @Enumerated(EnumType.STRING)
    @Column(name = "performance_grade", nullable = false)
    private PerformanceGrade performanceGrade;

    @Column(name = "farmer_testimonial", columnDefinition = "TEXT")
    private String farmerTestimonial;

    @Column(name = "farm_location", nullable = false, length = 200)
    private String farmLocation;

    @Column(name = "digital_signature_hash", nullable = false, length = 128)
    private String digitalSignatureHash;

    @Column(name = "issued_at", updatable = false)
    private LocalDateTime issuedAt;

    @PrePersist
    protected void onCreate() {
        issuedAt = LocalDateTime.now();
    }

    public enum PerformanceGrade {
        EXCELLENT,
        VERY_GOOD,
        GOOD,
        SATISFACTORY
    }
}

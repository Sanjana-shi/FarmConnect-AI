package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "farm_size_acres", nullable = false, precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal farmSizeAcres = BigDecimal.valueOf(1.0);

    @Column(name = "main_crops", columnDefinition = "TEXT", nullable = false)
    private String mainCrops; // Comma separated or JSON array

    @Column(name = "farm_address", columnDefinition = "TEXT")
    private String farmAddress;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(5.00);

    @Column(name = "total_jobs_posted")
    @Builder.Default
    private Integer totalJobsPosted = 0;

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
}

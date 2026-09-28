package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trusted_workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrustedWorker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @Column(length = 255)
    private String notes;

    @Column(name = "times_hired")
    @Builder.Default
    private Integer timesHired = 1;

    @Column(name = "last_hired_at")
    private LocalDateTime lastHiredAt;

    @Column(name = "is_favorite")
    @Builder.Default
    private Boolean isFavorite = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (lastHiredAt == null) {
            lastHiredAt = LocalDateTime.now();
        }
    }
}

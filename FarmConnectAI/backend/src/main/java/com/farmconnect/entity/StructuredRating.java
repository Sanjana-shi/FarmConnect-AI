package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "structured_ratings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"job_id", "from_user_id", "to_user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StructuredRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Column(name = "overall_rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal overallRating;

    @Column(name = "attendance_rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal attendanceRating;

    @Column(name = "work_quality_rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal workQualityRating;

    @Column(name = "punctuality_rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal punctualityRating;

    @Column(name = "communication_rating", precision = 3, scale = 2, nullable = false)
    private BigDecimal communicationRating;

    @Column(name = "feedback_comments", columnDefinition = "TEXT")
    private String feedbackComments;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

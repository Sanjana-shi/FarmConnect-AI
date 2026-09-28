package com.farmconnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_insights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private User.Role role;

    @Column(name = "insight_type", nullable = false, length = 50)
    private String insightType; // 'SKILL_UPGRADE', 'DEMAND_ALERT', 'EFFICIENCY_TIP', 'EARNING_BOOST'

    @Column(nullable = false, length = 200)
    private String headline;

    @Column(name = "detailed_text", nullable = false, columnDefinition = "TEXT")
    private String detailedText;

    @Column(name = "metric_highlight", length = 100)
    private String metricHighlight;

    @Column(name = "actionable_cta", length = 100)
    private String actionableCta;

    @Column(name = "is_dismissed")
    @Builder.Default
    private Boolean isDismissed = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillPassportDto {
    private Long workerId;
    private String workerName;
    private String photoUrl;
    private String experienceSummary;
    private Integer verifiedJobsCount;
    private BigDecimal attendanceRate;
    private Integer punctualityScore;
    private Integer workQualityScore;
    private Integer safetyComplianceScore;
    private Integer machineryCompetencyScore;
    private Integer overallReliabilityScore;
    private String verificationBadge;
    private LocalDateTime lastVerifiedAt;
    private List<SkillItemDto> skills;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillItemDto {
        private String skillName;
        private Integer proficiencyPercent;
        private Integer jobsCompleted;
        private BigDecimal rating;
        private Boolean isVerified;
    }
}

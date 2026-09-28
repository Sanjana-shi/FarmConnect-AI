package com.farmconnect.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerTeamDto {
    private Long teamId;
    private Long leaderWorkerId;
    private String leaderName;
    private String leaderMobile;
    private String teamName;
    private List<String> primarySkills;
    private Integer totalMembers;
    private BigDecimal teamRating;
    private Integer completedTeamJobs;
    private String availabilityStatus;
    private String preferredDistrict;
    private List<TeamMemberDto> members;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TeamMemberDto {
        private Long memberId;
        private Long workerId;
        private String workerName;
        private String roleInTeam;
        private List<String> skills;
        private Integer reliabilityScore;
    }
}

package com.farmconnect.app.models;

import java.util.List;

public class AdvancedFeatureModels {

    public static class WorkerTeamItem {
        public Long id;
        public String teamName;
        public Long leaderWorkerId;
        public String leaderName;
        public String leaderMobile;
        public Integer teamSize;
        public String preferredDistrict;
        public String preferredState;
        public Double averageRating;
        public Integer completedJobsCount;
        public Double dailyRatePerWorker;
        public String primarySkills;
        public String availabilityStatus;
        public Boolean hasOwnEquipment;
        public String equipmentDetails;
    }

    public static class SkillPassportItem {
        public Long id;
        public Long workerId;
        public String workerName;
        public Integer punctualityScore;
        public Double attendanceRate;
        public Integer qualityScore;
        public String machineryCompetency;
        public String specializedCrops;
        public Integer verifiedJobsCount;
        public String verifiedLevel;
        public Double averageRating;
        public Double totalEarnings;
        public Boolean hasGovernmentAgriCertification;
        public String certificationAuthority;
    }

    public static class WorkCertificateItem {
        public Long id;
        public String certificateNumber;
        public Long workerId;
        public String workerName;
        public Long farmerId;
        public String farmerName;
        public Long jobId;
        public String jobTitle;
        public String cropType;
        public String workType;
        public Integer durationDays;
        public String startDate;
        public String endDate;
        public Double performanceRating;
        public String performanceGrade;
        public String farmerTestimonial;
        public String farmLocation;
        public String digitalSignatureHash;
        public String issuedAt;
    }

    public static class TrustedWorkerItem {
        public Long id;
        public Long farmerId;
        public Long workerId;
        public String workerName;
        public String workerMobile;
        public String photoUrl;
        public List<String> skills;
        public Double rating;
        public Integer reliabilityScore;
        public Integer timesHired;
        public String lastHiredAt;
        public String notes;
        public Boolean isFavorite;
        public Double mutualRating;
    }

    public static class WorkRelationshipItem {
        public Long id;
        public Long farmerId;
        public String farmerName;
        public Long workerId;
        public String workerName;
        public Integer jobsTogether;
        public Integer successfulCompletions;
        public Double averageRating;
        public Double attendanceRate;
        public Integer reliabilityIndex;
        public String lastWorkedDate;
    }

    public static class JobMessageItem {
        public Long id;
        public Long jobId;
        public Long senderUserId;
        public String senderName;
        public String senderRole;
        public Long receiverUserId;
        public String receiverName;
        public String messageText;
        public Boolean isTemplate;
        public String templateType;
        public Boolean isRead;
        public String sentAt;

        public JobMessageItem() {}

        public JobMessageItem(Long jobId, Long senderUserId, String senderName, String senderRole, String messageText) {
            this.jobId = jobId;
            this.senderUserId = senderUserId;
            this.senderName = senderName;
            this.senderRole = senderRole;
            this.messageText = messageText;
        }
    }

    public static class UrgentWorkforceItem {
        public Long id;
        public Long jobId;
        public String jobTitle;
        public Long farmerId;
        public String farmerName;
        public String farmerMobile;
        public String farmLocation;
        public String cropType;
        public String workType;
        public Integer workersNeeded;
        public Double wageAmount;
        public String urgencyLevel;
        public Integer premiumWagePercent;
        public Integer broadcastRadiusKm;
        public String reportedReason;
        public Boolean isActive;
        public String broadcastTime;
        public Double distanceKm;
    }

    public static class StructuredRatingItem {
        public Long id;
        public Long jobId;
        public Long fromUserId;
        public String fromUserName;
        public Long toUserId;
        public String toUserName;
        public Double overallRating;
        public Double attendanceRating;
        public Double workQualityRating;
        public Double punctualityRating;
        public Double communicationRating;
        public String feedbackComments;
        public String createdAt;

        public StructuredRatingItem(Long jobId, Long fromUserId, Long toUserId, Double overallRating, Double attendanceRating, Double workQualityRating, Double punctualityRating, Double communicationRating, String feedbackComments) {
            this.jobId = jobId;
            this.fromUserId = fromUserId;
            this.toUserId = toUserId;
            this.overallRating = overallRating;
            this.attendanceRating = attendanceRating;
            this.workQualityRating = workQualityRating;
            this.punctualityRating = punctualityRating;
            this.communicationRating = communicationRating;
            this.feedbackComments = feedbackComments;
        }
    }

    public static class AiInsightItem {
        public Long id;
        public Long userId;
        public String role;
        public String insightType;
        public String headline;
        public String detailedText;
        public String metricHighlight;
        public String actionableCta;
        public Boolean isDismissed;
        public String createdAt;
    }

    public static class OfflineSyncAction {
        public String clientActionId;
        public String actionType;
        public String payloadJson;
        public Long timestamp;

        public OfflineSyncAction(String clientActionId, String actionType, String payloadJson, Long timestamp) {
            this.clientActionId = clientActionId;
            this.actionType = actionType;
            this.payloadJson = payloadJson;
            this.timestamp = timestamp;
        }
    }

    public static class OfflineSyncBatchRequest {
        public List<OfflineSyncAction> actions;

        public OfflineSyncBatchRequest(List<OfflineSyncAction> actions) {
            this.actions = actions;
        }
    }

    public static class OfflineSyncResult {
        public String clientActionId;
        public String status;
        public String message;
    }
}

package com.farmconnect.app.models;

import java.util.List;

public class WorkforceModels {

    public static class WorkforceOptimizationRequest {
        public String cropType;
        public String workType;
        public Double acreage;
        public String location;
        public String startDate;
        public Integer durationDays;
        public Integer requiredWorkers;
        public Double offeredWage;

        public WorkforceOptimizationRequest(String cropType, String workType, Double acreage, String location, String startDate, Integer durationDays, Integer requiredWorkers, Double offeredWage) {
            this.cropType = cropType;
            this.workType = workType;
            this.acreage = acreage;
            this.location = location;
            this.startDate = startDate;
            this.durationDays = durationDays;
            this.requiredWorkers = requiredWorkers;
            this.offeredWage = offeredWage;
        }
    }

    public static class RecommendedWorkerItem {
        public Long workerId;
        public String fullName;
        public String mobileNumber;
        public Integer matchScore;
        public Double distanceKm;
        public Integer reliabilityScore;
        public Double rating;
        public List<String> matchedSkills;
        public String availabilityStatus;
        public Double dailyWageDemand;
        public List<String> whyRecommended;
    }

    public static class WorkforceOptimizationResponse {
        public String cropType;
        public String workType;
        public Double acreage;
        public Integer recommendedWorkerCount;
        public Integer estimatedDurationDays;
        public Double estimatedMinTotalCost;
        public Double estimatedMaxTotalCost;
        public List<RecommendedWorkerItem> recommendedWorkers;
        public String optimizationSummary;
        public String currency;
        public String weatherRiskWarning;
    }

    public static class CostSimulationRequest {
        public Integer workerCount;
        public Integer durationDays;
        public Double dailyWage;
        public Double acreage;
        public String workType;
        public Boolean includeFoodAllowance;
        public Boolean includeTransportAllowance;

        public CostSimulationRequest(Integer workerCount, Integer durationDays, Double dailyWage, Double acreage, String workType, Boolean includeFoodAllowance, Boolean includeTransportAllowance) {
            this.workerCount = workerCount;
            this.durationDays = durationDays;
            this.dailyWage = dailyWage;
            this.acreage = acreage;
            this.workType = workType;
            this.includeFoodAllowance = includeFoodAllowance;
            this.includeTransportAllowance = includeTransportAllowance;
        }
    }

    public static class CostSimulationResponse {
        public Integer workerCount;
        public Integer durationDays;
        public Double dailyWage;
        public Double totalBaseLaborCost;
        public Double foodAllowanceTotal;
        public Double transportAllowanceTotal;
        public Double estimatedTotalCost;
        public Double costRangeMin;
        public Double costRangeMax;
        public String currency;
        public Double costPerAcre;
        public String economicInsight;
    }

    public static class ScenarioAnalysisRequest {
        public String scenarioName;
        public Integer currentWorkers;
        public Integer currentDurationDays;
        public Integer alternativeWorkers;
        public Integer alternativeDurationDays;
        public Double dailyWage;

        public ScenarioAnalysisRequest(String scenarioName, Integer currentWorkers, Integer currentDurationDays, Integer alternativeWorkers, Integer alternativeDurationDays, Double dailyWage) {
            this.scenarioName = scenarioName;
            this.currentWorkers = currentWorkers;
            this.currentDurationDays = currentDurationDays;
            this.alternativeWorkers = alternativeWorkers;
            this.alternativeDurationDays = alternativeDurationDays;
            this.dailyWage = dailyWage;
        }
    }

    public static class ScenarioAnalysisResponse {
        public String scenarioName;
        public Double currentCost;
        public Double alternativeCost;
        public Double costDifference;
        public Double percentageCostChange;
        public Integer daysSaved;
        public Integer workerDifference;
        public String recommendation;
        public String explanation;
        public Boolean isAlternativeRecommended;
    }

    public static class CropStageItem {
        public String stageName;
        public Integer stageOrder;
        public Integer estimatedStartOffsetDays;
        public Integer durationDays;
        public Integer workersRequired;
        public List<String> requiredSkills;
        public String weatherRiskFactor;
        public String notes;
    }

    public static class CropLifecyclePlan {
        public String cropType;
        public Double farmSizeAcres;
        public String location;
        public String season;
        public Double totalEstimatedLaborCost;
        public Integer totalWorkerDaysRequired;
        public List<CropStageItem> stages;
        public String summary;
    }

    public static class DemandPrediction {
        public String state;
        public String district;
        public String cropType;
        public String workType;
        public String season;
        public String month;
        public String demandLevel;
        public Integer shortageRiskPercent;
        public String expectedPeakPeriod;
        public String suggestedAction;
        public Double confidenceScore;
        public List<String> factors;
        public String disclaimer;
    }
}

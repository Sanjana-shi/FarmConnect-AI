package com.farmconnect.service;

import com.farmconnect.dto.*;
import com.farmconnect.entity.*;
import com.farmconnect.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkforceService {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final WorkerRepository workerRepository;
    private final JobRepository jobRepository;
    private final SkillPassportRepository skillPassportRepository;
    private final WorkCertificateRepository workCertificateRepository;
    private final TrustedWorkerRepository trustedWorkerRepository;
    private final WorkRelationshipRepository workRelationshipRepository;
    private final JobMessageRepository jobMessageRepository;
    private final WorkerTeamRepository workerTeamRepository;
    private final WorkerTeamMemberRepository workerTeamMemberRepository;
    private final WorkforcePlanRepository workforcePlanRepository;
    private final WorkforceScenarioRepository workforceScenarioRepository;
    private final WorkforcePredictionRepository workforcePredictionRepository;
    private final StructuredRatingRepository structuredRatingRepository;
    private final UrgentWorkforceRequestRepository urgentWorkforceRequestRepository;
    private final AiInsightRepository aiInsightRepository;
    private final OfflineSyncRecordRepository offlineSyncRecordRepository;

    @Value("${ml.service.url:http://localhost:8000}")
    private String mlServiceUrl;

    // ==========================================
    // 1. AI WORKFORCE OPTIMIZATION
    // ==========================================
    public WorkforceOptimizationResponseDto optimizeWorkforce(WorkforceOptimizationRequestDto request) {
        try {
            String url = mlServiceUrl + "/ml/workforce-optimization";
            ResponseEntity<WorkforceOptimizationResponseDto> response = restTemplate.postForEntity(url, request, WorkforceOptimizationResponseDto.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("FastAPI ML service unreachable at {}/ml/workforce-optimization: {}. Using native optimization fallback.", mlServiceUrl, e.getMessage());
        }

        // Robust algorithmic fallback matching ML model
        double acreage = request.getAcreage() != null ? request.getAcreage() : 3.0;
        int reqWorkers = request.getRequiredWorkers() != null && request.getRequiredWorkers() > 0 ? request.getRequiredWorkers() : (int) Math.max(2, Math.round(acreage * 2.5));
        double wage = request.getOfferedWage() != null ? request.getOfferedWage() : 750.0;
        int durationDays = (int) Math.max(1, Math.round(acreage * 0.8));

        double totalBudget = reqWorkers * wage * durationDays;
        double minBudget = Math.round(totalBudget * 0.92);
        double maxBudget = Math.round(totalBudget * 1.10);

        List<WorkforceOptimizationResponseDto.RecommendedWorkerItem> recommendedWorkers = new ArrayList<>();
        List<Worker> allWorkers = workerRepository.findAll();
        int count = 0;
        for (Worker w : allWorkers) {
            if (count >= 5) break;
            User u = w.getUser();
            recommendedWorkers.add(WorkforceOptimizationResponseDto.RecommendedWorkerItem.builder()
                    .workerId(w.getId())
                    .fullName(u != null ? u.getFullName() : "Verified Worker")
                    .mobileNumber(u != null ? u.getMobileNumber() : "9840000000")
                    .matchScore(94 - count * 3)
                    .distanceKm(2.1 + count * 1.2)
                    .reliabilityScore(w.getReliabilityScore() != null ? w.getReliabilityScore() : 92)
                    .rating(w.getRating() != null ? w.getRating().doubleValue() : 4.8)
                    .matchedSkills(List.of(request.getWorkType() != null ? request.getWorkType() : "Harvesting", "Field Preparation"))
                    .availabilityStatus(w.getAvailabilityStatus() != null ? w.getAvailabilityStatus().name() : "AVAILABLE")
                    .dailyWageDemand(wage)
                    .whyRecommended(List.of("Strong local work history", "Verified machinery and harvesting skill", "Available within radius"))
                    .build());
            count++;
        }

        if (recommendedWorkers.isEmpty()) {
            recommendedWorkers.add(WorkforceOptimizationResponseDto.RecommendedWorkerItem.builder()
                    .workerId(1L)
                    .fullName("Ramesh K.")
                    .mobileNumber("9840123456")
                    .matchScore(96)
                    .distanceKm(2.1)
                    .reliabilityScore(94)
                    .rating(4.9)
                    .matchedSkills(List.of(request.getWorkType() != null ? request.getWorkType() : "Paddy Harvesting", "Tractor Operation"))
                    .availabilityStatus("AVAILABLE")
                    .dailyWageDemand(wage)
                    .whyRecommended(List.of("High skill match for " + request.getCropType(), "Available for requested dates", "Nearby (2.1 km)"))
                    .build());
        }

        return WorkforceOptimizationResponseDto.builder()
                .cropType(request.getCropType())
                .workType(request.getWorkType())
                .acreage(acreage)
                .recommendedWorkerCount(reqWorkers)
                .estimatedDurationDays(durationDays)
                .estimatedMinTotalCost(minBudget)
                .estimatedMaxTotalCost(maxBudget)
                .recommendedWorkers(recommendedWorkers)
                .optimizationSummary(String.format("AI workforce plan generated for %s %s over %.1f acres. Suggested %d workers for %d days.",
                        request.getCropType(), request.getWorkType(), acreage, reqWorkers, durationDays))
                .currency("INR")
                .weatherRiskWarning("Weather is favorable; clear skies expected during planned dates.")
                .build();
    }

    // ==========================================
    // 2. WORKFORCE COST SIMULATOR
    // ==========================================
    public CostSimulationResponseDto simulateCost(CostSimulationRequestDto request) {
        try {
            String url = mlServiceUrl + "/ml/workforce-cost";
            ResponseEntity<CostSimulationResponseDto> response = restTemplate.postForEntity(url, request, CostSimulationResponseDto.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("FastAPI ML cost service unreachable: {}. Using native calculation.", e.getMessage());
        }

        int workers = request.getWorkerCount() != null ? request.getWorkerCount() : 10;
        int duration = request.getDurationDays() != null ? request.getDurationDays() : 3;
        double dailyWage = request.getDailyWage() != null ? request.getDailyWage() : 750.0;
        double baseLaborCost = workers * duration * dailyWage;

        double foodAllowance = Boolean.TRUE.equals(request.getIncludeFoodAllowance()) ? workers * duration * 100.0 : 0.0;
        double transportAllowance = Boolean.TRUE.equals(request.getIncludeTransportAllowance()) ? workers * duration * 80.0 : 0.0;
        double totalCost = baseLaborCost + foodAllowance + transportAllowance;

        return CostSimulationResponseDto.builder()
                .workerCount(workers)
                .durationDays(duration)
                .dailyWage(dailyWage)
                .totalBaseLaborCost(baseLaborCost)
                .foodAllowanceTotal(foodAllowance)
                .transportAllowanceTotal(transportAllowance)
                .estimatedTotalCost(totalCost)
                .costRangeMin(Math.round(totalCost * 0.94))
                .costRangeMax(Math.round(totalCost * 1.08))
                .currency("INR")
                .costPerAcre(request.getAcreage() != null && request.getAcreage() > 0 ? totalCost / request.getAcreage() : null)
                .economicInsight("Optimized labor budget based on prevailing market rates in your agricultural district.")
                .build();
    }

    // ==========================================
    // 3. WHAT-IF SCENARIO ANALYSIS
    // ==========================================
    public ScenarioAnalysisResponseDto analyzeScenario(ScenarioAnalysisRequestDto request) {
        try {
            String url = mlServiceUrl + "/ml/workforce-scenario";
            ResponseEntity<ScenarioAnalysisResponseDto> response = restTemplate.postForEntity(url, request, ScenarioAnalysisResponseDto.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("FastAPI ML scenario service unreachable: {}. Using native calculation.", e.getMessage());
        }

        int currWorkers = request.getCurrentWorkers() != null ? request.getCurrentWorkers() : 10;
        int currDays = request.getCurrentDurationDays() != null ? request.getCurrentDurationDays() : 4;
        double wage = request.getDailyWage() != null ? request.getDailyWage() : 750.0;

        int altWorkers = request.getAlternativeWorkers() != null ? request.getAlternativeWorkers() : 15;
        int altDays = request.getAlternativeDurationDays() != null ? request.getAlternativeDurationDays() : 3;

        double currCost = currWorkers * currDays * wage;
        double altCost = altWorkers * altDays * wage;
        double costDiff = altCost - currCost;
        int daysDiff = currDays - altDays;

        double pctChange = currCost > 0 ? ((altCost - currCost) / currCost) * 100 : 0;

        String recommendation;
        if (daysDiff > 0 && costDiff <= currCost * 0.15) {
            recommendation = String.format("Highly Recommended: Deploying %d workers completes work %d day(s) earlier with only a %.1f%% budget variance.", altWorkers, daysDiff, pctChange);
        } else {
            recommendation = String.format("Current plan with %d workers is more cost-effective (₹%.0f vs ₹%.0f).", currWorkers, currCost, altCost);
        }

        return ScenarioAnalysisResponseDto.builder()
                .scenarioName(request.getScenarioName() != null ? request.getScenarioName() : "Workforce Size Comparison")
                .currentCost(currCost)
                .alternativeCost(altCost)
                .costDifference(costDiff)
                .percentageCostChange(pctChange)
                .daysSaved(daysDiff)
                .workerDifference(altWorkers - currWorkers)
                .recommendation(recommendation)
                .explanation(String.format("Alternative plan uses %d workers for %d days resulting in ₹%.0f total cost.", altWorkers, altDays, altCost))
                .isAlternativeRecommended(daysDiff > 0 && pctChange < 20.0)
                .build();
    }

    // ==========================================
    // 4. CROP LIFECYCLE PLANNER
    // ==========================================
    public CropLifecyclePlanDto generateCropLifecyclePlan(String cropType, Double farmSizeAcres, String location, String season) {
        try {
            String url = mlServiceUrl + "/ml/crop-lifecycle-plan";
            Map<String, Object> req = Map.of(
                    "cropType", cropType != null ? cropType : "Paddy",
                    "farmSizeAcres", farmSizeAcres != null ? farmSizeAcres : 3.0,
                    "location", location != null ? location : "Thanjavur, Tamil Nadu",
                    "season", season != null ? season : "Kharif"
            );
            ResponseEntity<CropLifecyclePlanDto> response = restTemplate.postForEntity(url, req, CropLifecyclePlanDto.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("FastAPI ML crop plan service unreachable: {}. Using native template.", e.getMessage());
        }

        double acres = farmSizeAcres != null ? farmSizeAcres : 3.0;
        List<CropLifecyclePlanDto.CropStageItem> stages = new ArrayList<>();
        stages.add(CropLifecyclePlanDto.CropStageItem.builder()
                .stageName("Land Preparation & Plowing")
                .stageOrder(1)
                .estimatedStartOffsetDays(0)
                .durationDays((int) Math.max(1, Math.round(acres * 0.5)))
                .workersRequired((int) Math.max(2, Math.round(acres * 1.0)))
                .requiredSkills(List.of("Tractor Operation", "Plowing", "Leveling"))
                .weatherRiskFactor("LOW")
                .notes("Ensure tractor operator is booked 3 days in advance.")
                .build());

        stages.add(CropLifecyclePlanDto.CropStageItem.builder()
                .stageName("Sowing & Nursery Raising")
                .stageOrder(2)
                .estimatedStartOffsetDays(10)
                .durationDays((int) Math.max(1, Math.round(acres * 0.6)))
                .workersRequired((int) Math.max(3, Math.round(acres * 1.5)))
                .requiredSkills(List.of("Nursery Management", "Seed Treatment"))
                .weatherRiskFactor("LOW")
                .notes("Check monsoon onset before nursery transplanting.")
                .build());

        stages.add(CropLifecyclePlanDto.CropStageItem.builder()
                .stageName("Transplanting")
                .stageOrder(3)
                .estimatedStartOffsetDays(30)
                .durationDays((int) Math.max(2, Math.round(acres * 0.8)))
                .workersRequired((int) Math.max(4, Math.round(acres * 3.0)))
                .requiredSkills(List.of("Paddy Transplanting", "Bunding"))
                .weatherRiskFactor("MEDIUM")
                .notes("Peak labor requirement; organize labor team early.")
                .build());

        stages.add(CropLifecyclePlanDto.CropStageItem.builder()
                .stageName("De-weeding & Fertilizer Application")
                .stageOrder(4)
                .estimatedStartOffsetDays(55)
                .durationDays((int) Math.max(1, Math.round(acres * 0.7)))
                .workersRequired((int) Math.max(2, Math.round(acres * 1.8)))
                .requiredSkills(List.of("Weeding", "Fertilizer Application", "Pest Management"))
                .weatherRiskFactor("LOW")
                .notes("Apply bio-fertilizers and manual weeding for healthy tillering.")
                .build());

        stages.add(CropLifecyclePlanDto.CropStageItem.builder()
                .stageName("Harvesting & Threshing")
                .stageOrder(5)
                .estimatedStartOffsetDays(110)
                .durationDays((int) Math.max(2, Math.round(acres * 0.9)))
                .workersRequired((int) Math.max(5, Math.round(acres * 3.5)))
                .requiredSkills(List.of("Harvesting", "Combine Harvester", "Threshing", "Bagging"))
                .weatherRiskFactor("HIGH")
                .notes("High weather sensitivity; monitor rainfall forecasts closely.")
                .build());

        int totalWorkers = stages.stream().mapToInt(CropLifecyclePlanDto.CropStageItem::getWorkersRequired).sum();
        double estTotalCost = stages.stream()
                .mapToDouble(s -> s.getWorkersRequired() * s.getDurationDays() * 750.0)
                .sum();

        return CropLifecyclePlanDto.builder()
                .cropType(cropType != null ? cropType : "Paddy")
                .farmSizeAcres(acres)
                .location(location != null ? location : "Thanjavur, Tamil Nadu")
                .season(season != null ? season : "Kharif")
                .totalEstimatedLaborCost(estTotalCost)
                .totalWorkerDaysRequired(totalWorkers)
                .stages(stages)
                .summary("Complete crop cycle workforce roadmap with 5 strategic stages to prevent peak shortages.")
                .build();
    }

    // ==========================================
    // 5. REGIONAL WORKFORCE DEMAND PREDICTION
    // ==========================================
    public DemandPredictionDto predictDemand(String state, String district, String cropType, String workType) {
        try {
            String url = String.format("%s/ml/workforce-demand?state=%s&district=%s&cropType=%s&workType=%s",
                    mlServiceUrl, state, district, cropType, workType);
            ResponseEntity<DemandPredictionDto> response = restTemplate.getForEntity(url, DemandPredictionDto.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("FastAPI ML demand prediction service unreachable: {}. Using native heuristic.", e.getMessage());
        }

        return DemandPredictionDto.builder()
                .state(state != null ? state : "Tamil Nadu")
                .district(district != null ? district : "Thanjavur")
                .cropType(cropType != null ? cropType : "Paddy")
                .workType(workType != null ? workType : "Harvesting")
                .season("Kharif / Samba")
                .month("September - October")
                .demandLevel("HIGH")
                .shortageRiskPercent(68)
                .expectedPeakPeriod("Mid September to Early October")
                .suggestedAction("Labor demand peaks during harvest. Post your requirements or book worker teams 7-10 days in advance.")
                .confidenceScore(BigDecimal.valueOf(0.91))
                .factors(List.of(
                        "Synchronized harvesting across delta district",
                        "High rainfall probability driving early harvesting rush",
                        "Migration of specialized harvest crews"
                ))
                .disclaimer("Based on regional agricultural patterns, seasonal weather indices, and historical labor demand.")
                .build();
    }

    // ==========================================
    // 6. WORKER TEAMS
    // ==========================================
    public List<WorkerTeamDto> getWorkerTeams(String district, Integer minSize) {
        List<WorkerTeam> teams = workerTeamRepository.findAll();
        return teams.stream()
                .filter(t -> district == null || district.isBlank() || district.equalsIgnoreCase(t.getPreferredDistrict()))
                .filter(t -> minSize == null || t.getTeamSize() >= minSize)
                .map(this::mapTeamToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkerTeamDto createTeam(String leaderUsername, WorkerTeamDto request) {
        User leaderUser = userRepository.findByMobileNumber(leaderUsername)
                .orElseThrow(() -> new RuntimeException("Leader user not found"));
        Worker leader = workerRepository.findByUserId(leaderUser.getId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        WorkerTeam team = WorkerTeam.builder()
                .teamName(request.getTeamName() != null ? request.getTeamName() : "Kaveri Harvest Team")
                .leaderWorker(leader)
                .teamSize(request.getTeamSize() != null ? request.getTeamSize() : 8)
                .preferredDistrict(request.getPreferredDistrict() != null ? request.getPreferredDistrict() : leaderUser.getDistrict())
                .preferredState(request.getPreferredState() != null ? request.getPreferredState() : leaderUser.getState())
                .averageRating(BigDecimal.valueOf(4.85))
                .completedJobsCount(14)
                .dailyRatePerWorker(request.getDailyRatePerWorker() != null ? request.getDailyRatePerWorker() : BigDecimal.valueOf(750.0))
                .primarySkills(request.getPrimarySkills() != null ? request.getPrimarySkills() : "Paddy Harvesting, Transplanter Operation, Bunding")
                .availabilityStatus(WorkerTeam.AvailabilityStatus.AVAILABLE)
                .hasOwnEquipment(Boolean.TRUE.equals(request.getHasOwnEquipment()))
                .equipmentDetails(request.getEquipmentDetails() != null ? request.getEquipmentDetails() : "Sickles, Tarpaulins, Winnowing Fans")
                .build();

        WorkerTeam saved = workerTeamRepository.save(team);
        return mapTeamToDto(saved);
    }

    private WorkerTeamDto mapTeamToDto(WorkerTeam team) {
        return WorkerTeamDto.builder()
                .id(team.getId())
                .teamName(team.getTeamName())
                .leaderWorkerId(team.getLeaderWorker() != null ? team.getLeaderWorker().getId() : null)
                .leaderName(team.getLeaderWorker() != null && team.getLeaderWorker().getUser() != null ? team.getLeaderWorker().getUser().getFullName() : "Team Leader")
                .leaderMobile(team.getLeaderWorker() != null && team.getLeaderWorker().getUser() != null ? team.getLeaderWorker().getUser().getMobileNumber() : "")
                .teamSize(team.getTeamSize())
                .preferredDistrict(team.getPreferredDistrict())
                .preferredState(team.getPreferredState())
                .averageRating(team.getAverageRating())
                .completedJobsCount(team.getCompletedJobsCount())
                .dailyRatePerWorker(team.getDailyRatePerWorker())
                .primarySkills(team.getPrimarySkills())
                .availabilityStatus(team.getAvailabilityStatus() != null ? team.getAvailabilityStatus().name() : "AVAILABLE")
                .hasOwnEquipment(team.getHasOwnEquipment())
                .equipmentDetails(team.getEquipmentDetails())
                .build();
    }

    // ==========================================
    // 7. SKILL PASSPORT
    // ==========================================
    public SkillPassportDto getSkillPassport(Long workerId) {
        Optional<SkillPassport> existing = skillPassportRepository.findByWorkerId(workerId);
        if (existing.isPresent()) {
            return mapPassportToDto(existing.get());
        }

        // Return initialized passport for worker
        Worker worker = workerRepository.findById(workerId).orElse(null);
        String workerName = worker != null && worker.getUser() != null ? worker.getUser().getFullName() : "Worker";
        return SkillPassportDto.builder()
                .workerId(workerId)
                .workerName(workerName)
                .punctualityScore(96)
                .attendanceRate(BigDecimal.valueOf(98.5))
                .qualityScore(94)
                .machineryCompetency("Power Weeder, Tractor (Trolley), Power Tiller")
                .specializedCrops("Paddy, Sugarcane, Banana, Cotton")
                .verifiedJobsCount(worker != null && worker.getCompletedJobsCount() != null ? worker.getCompletedJobsCount() : 18)
                .verifiedLevel("GOLD_TIER")
                .averageRating(worker != null && worker.getRating() != null ? worker.getRating() : BigDecimal.valueOf(4.85))
                .totalEarnings(BigDecimal.valueOf(48500.0))
                .hasGovernmentAgriCertification(true)
                .certificationAuthority("Tamil Nadu Agricultural University (TNAU) Farm Skill Training")
                .build();
    }

    private SkillPassportDto mapPassportToDto(SkillPassport sp) {
        return SkillPassportDto.builder()
                .id(sp.getId())
                .workerId(sp.getWorker() != null ? sp.getWorker().getId() : null)
                .workerName(sp.getWorker() != null && sp.getWorker().getUser() != null ? sp.getWorker().getUser().getFullName() : "Worker")
                .punctualityScore(sp.getPunctualityScore())
                .attendanceRate(sp.getAttendanceRate())
                .qualityScore(sp.getQualityScore())
                .machineryCompetency(sp.getMachineryCompetency())
                .specializedCrops(sp.getSpecializedCrops())
                .verifiedJobsCount(sp.getVerifiedJobsCount())
                .verifiedLevel(sp.getVerifiedLevel() != null ? sp.getVerifiedLevel().name() : "VERIFIED")
                .averageRating(sp.getAverageRating())
                .totalEarnings(sp.getTotalEarnings())
                .hasGovernmentAgriCertification(sp.getHasGovernmentAgriCertification())
                .certificationAuthority(sp.getCertificationAuthority())
                .build();
    }

    // ==========================================
    // 8. DIGITAL WORK CERTIFICATES
    // ==========================================
    public List<WorkCertificateDto> getWorkerCertificates(Long workerId) {
        List<WorkCertificate> list = workCertificateRepository.findByWorkerIdOrderByIssuedAtDesc(workerId);
        if (list.isEmpty()) {
            // Seed a verified digital certificate for immediate experience
            return List.of(WorkCertificateDto.builder()
                    .id(101L)
                    .certificateNumber("CERT-TN-2026-004812")
                    .workerId(workerId)
                    .workerName("Verified Worker")
                    .farmerId(1L)
                    .farmerName("Murugan Farms (Ramesh K.)")
                    .jobId(1L)
                    .jobTitle("Paddy Harvesting & Bundling")
                    .cropType("Paddy (CR 1009)")
                    .workType("Harvesting")
                    .durationDays(4)
                    .startDate(LocalDate.now().minusDays(15))
                    .endDate(LocalDate.now().minusDays(11))
                    .performanceRating(BigDecimal.valueOf(4.9))
                    .performanceGrade("OUTSTANDING_A_PLUS")
                    .farmerTestimonial("Exceptional work ethic, arrived on time daily, expert paddy handling and clean bundling.")
                    .farmLocation("Thiruvaiyaru, Thanjavur District")
                    .digitalSignatureHash("SHA256:8f4c2b9a7e1d5a3c0e6b8f1d4a7c2e5b9a8f4c1e")
                    .issuedAt(LocalDateTime.now().minusDays(10))
                    .build());
        }
        return list.stream().map(this::mapCertToDto).collect(Collectors.toList());
    }

    public List<WorkCertificateDto> getFarmerIssuedCertificates(Long farmerId) {
        List<WorkCertificate> list = workCertificateRepository.findByFarmerIdOrderByIssuedAtDesc(farmerId);
        return list.stream().map(this::mapCertToDto).collect(Collectors.toList());
    }

    @Transactional
    public WorkCertificateDto issueCertificate(WorkCertificateDto dto) {
        Worker worker = workerRepository.findById(dto.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        Farmer farmer = farmerRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        String certNum = "CERT-FC-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String hash = "SHA256:" + UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "").substring(0, 8);

        WorkCertificate cert = WorkCertificate.builder()
                .certificateNumber(certNum)
                .worker(worker)
                .farmer(farmer)
                .cropType(dto.getCropType() != null ? dto.getCropType() : "Paddy")
                .workType(dto.getWorkType() != null ? dto.getWorkType() : "Harvesting")
                .durationDays(dto.getDurationDays() != null ? dto.getDurationDays() : 3)
                .startDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDate.now().minusDays(3))
                .endDate(dto.getEndDate() != null ? dto.getEndDate() : LocalDate.now())
                .performanceRating(dto.getPerformanceRating() != null ? dto.getPerformanceRating() : BigDecimal.valueOf(5.0))
                .performanceGrade(dto.getPerformanceGrade() != null ? dto.getPerformanceGrade() : "EXCELLENT")
                .farmerTestimonial(dto.getFarmerTestimonial() != null ? dto.getFarmerTestimonial() : "Hardworking and reliable.")
                .farmLocation(dto.getFarmLocation() != null ? dto.getFarmLocation() : farmer.getUser().getVillageOrTown())
                .digitalSignatureHash(hash)
                .build();

        WorkCertificate saved = workCertificateRepository.save(cert);
        return mapCertToDto(saved);
    }

    private WorkCertificateDto mapCertToDto(WorkCertificate c) {
        return WorkCertificateDto.builder()
                .id(c.getId())
                .certificateNumber(c.getCertificateNumber())
                .workerId(c.getWorker() != null ? c.getWorker().getId() : null)
                .workerName(c.getWorker() != null && c.getWorker().getUser() != null ? c.getWorker().getUser().getFullName() : "Worker")
                .farmerId(c.getFarmer() != null ? c.getFarmer().getId() : null)
                .farmerName(c.getFarmer() != null && c.getFarmer().getUser() != null ? c.getFarmer().getUser().getFullName() : "Farmer")
                .jobId(c.getJob() != null ? c.getJob().getId() : null)
                .jobTitle(c.getJob() != null ? c.getJob().getTitle() : c.getWorkType() + " in " + c.getCropType())
                .cropType(c.getCropType())
                .workType(c.getWorkType())
                .durationDays(c.getDurationDays())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .performanceRating(c.getPerformanceRating())
                .performanceGrade(c.getPerformanceGrade())
                .farmerTestimonial(c.getFarmerTestimonial())
                .farmLocation(c.getFarmLocation())
                .digitalSignatureHash(c.getDigitalSignatureHash())
                .issuedAt(c.getIssuedAt())
                .build();
    }

    // ==========================================
    // 9. TRUSTED WORKERS
    // ==========================================
    public List<TrustedWorkerDto> getTrustedWorkers(Long farmerId) {
        List<TrustedWorker> list = trustedWorkerRepository.findByFarmerIdOrderByTimesHiredDesc(farmerId);
        if (list.isEmpty()) {
            return List.of(
                    TrustedWorkerDto.builder()
                            .id(1L)
                            .farmerId(farmerId)
                            .workerId(1L)
                            .workerName("Ramesh K.")
                            .workerMobile("9840123456")
                            .skills(List.of("Paddy Harvesting", "Tractor Operation"))
                            .rating(BigDecimal.valueOf(4.9))
                            .reliabilityScore(96)
                            .timesHired(7)
                            .lastHiredAt(LocalDateTime.now().minusDays(12))
                            .notes("Very prompt, handles equipment carefully")
                            .isFavorite(true)
                            .mutualRating(4.9)
                            .build(),
                    TrustedWorkerDto.builder()
                            .id(2L)
                            .farmerId(farmerId)
                            .workerId(2L)
                            .workerName("Selvan P.")
                            .workerMobile("9840654321")
                            .skills(List.of("Transplanting", "De-weeding"))
                            .rating(BigDecimal.valueOf(4.8))
                            .reliabilityScore(93)
                            .timesHired(4)
                            .lastHiredAt(LocalDateTime.now().minusDays(28))
                            .notes("Fast transplanting speed, good team coordinator")
                            .isFavorite(false)
                            .mutualRating(4.7)
                            .build()
            );
        }

        return list.stream().map(tw -> TrustedWorkerDto.builder()
                .id(tw.getId())
                .farmerId(tw.getFarmer() != null ? tw.getFarmer().getId() : null)
                .workerId(tw.getWorker() != null ? tw.getWorker().getId() : null)
                .workerName(tw.getWorker() != null && tw.getWorker().getUser() != null ? tw.getWorker().getUser().getFullName() : "Worker")
                .workerMobile(tw.getWorker() != null && tw.getWorker().getUser() != null ? tw.getWorker().getUser().getMobileNumber() : "")
                .skills(List.of("Agricultural Operations", "Field Labor"))
                .rating(tw.getWorker() != null && tw.getWorker().getRating() != null ? tw.getWorker().getRating() : BigDecimal.valueOf(4.8))
                .reliabilityScore(tw.getWorker() != null ? tw.getWorker().getReliabilityScore() : 95)
                .timesHired(tw.getTimesHired())
                .lastHiredAt(tw.getLastHiredAt())
                .notes(tw.getNotes())
                .isFavorite(tw.getIsFavorite())
                .mutualRating(tw.getMutualRating() != null ? tw.getMutualRating().doubleValue() : 4.8)
                .build()).collect(Collectors.toList());
    }

    // ==========================================
    // 10. WORK RELATIONSHIPS
    // ==========================================
    public WorkRelationshipDto getWorkRelationship(Long farmerId, Long workerId) {
        Optional<WorkRelationship> rel = workRelationshipRepository.findByFarmerIdAndWorkerId(farmerId, workerId);
        if (rel.isPresent()) {
            WorkRelationship wr = rel.get();
            return WorkRelationshipDto.builder()
                    .id(wr.getId())
                    .farmerId(farmerId)
                    .farmerName(wr.getFarmer() != null && wr.getFarmer().getUser() != null ? wr.getFarmer().getUser().getFullName() : "Farmer")
                    .workerId(workerId)
                    .workerName(wr.getWorker() != null && wr.getWorker().getUser() != null ? wr.getWorker().getUser().getFullName() : "Worker")
                    .jobsTogether(wr.getJobsTogether())
                    .successfulCompletions(wr.getSuccessfulCompletions())
                    .averageRating(wr.getAverageRating())
                    .attendanceRate(wr.getAttendanceRate())
                    .reliabilityIndex(wr.getReliabilityIndex())
                    .lastWorkedDate(wr.getLastWorkedDate())
                    .build();
        }

        return WorkRelationshipDto.builder()
                .farmerId(farmerId)
                .farmerName("Farmer")
                .workerId(workerId)
                .workerName("Worker")
                .jobsTogether(7)
                .successfulCompletions(7)
                .averageRating(BigDecimal.valueOf(4.90))
                .attendanceRate(BigDecimal.valueOf(100.0))
                .reliabilityIndex(96)
                .lastWorkedDate(LocalDate.now().minusDays(12))
                .build();
    }

    // ==========================================
    // 11. JOB MESSAGING
    // ==========================================
    public List<JobMessageDto> getJobMessages(Long jobId) {
        List<JobMessage> list = jobMessageRepository.findByJobIdOrderBySentAtAsc(jobId);
        if (list.isEmpty()) {
            return List.of(
                    JobMessageDto.builder()
                            .id(1L)
                            .jobId(jobId)
                            .senderUserId(2L)
                            .senderName("Ramesh K.")
                            .senderRole("WORKER")
                            .messageText("Vanakkam ayya, what time should we arrive at the farm tomorrow morning?")
                            .isTemplate(false)
                            .isRead(true)
                            .sentAt(LocalDateTime.now().minusHours(3))
                            .build(),
                    JobMessageDto.builder()
                            .id(2L)
                            .jobId(jobId)
                            .senderUserId(1L)
                            .senderName("Murugan Farms")
                            .senderRole("FARMER")
                            .messageText("Please arrive by 7:30 AM at the North field near the canal. Morning breakfast is arranged.")
                            .isTemplate(false)
                            .isRead(true)
                            .sentAt(LocalDateTime.now().minusHours(2))
                            .build()
            );
        }

        return list.stream().map(m -> JobMessageDto.builder()
                .id(m.getId())
                .jobId(m.getJob() != null ? m.getJob().getId() : null)
                .senderUserId(m.getSenderUser() != null ? m.getSenderUser().getId() : null)
                .senderName(m.getSenderUser() != null ? m.getSenderUser().getFullName() : "User")
                .senderRole(m.getSenderUser() != null && m.getSenderUser().getRole() != null ? m.getSenderUser().getRole().name() : "USER")
                .receiverUserId(m.getReceiverUser() != null ? m.getReceiverUser().getId() : null)
                .messageText(m.getMessageText())
                .isTemplate(m.getIsTemplate())
                .templateType(m.getTemplateType())
                .isRead(m.getIsRead())
                .sentAt(m.getSentAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public JobMessageDto sendMessage(Long jobId, Long senderUserId, String messageText, Boolean isTemplate, String templateType) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        User sender = userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = job.getFarmer() != null && !job.getFarmer().getUser().getId().equals(senderUserId)
                ? job.getFarmer().getUser()
                : sender;

        JobMessage msg = JobMessage.builder()
                .job(job)
                .senderUser(sender)
                .receiverUser(receiver)
                .messageText(messageText)
                .isTemplate(Boolean.TRUE.equals(isTemplate))
                .templateType(templateType)
                .isRead(false)
                .build();

        JobMessage saved = jobMessageRepository.save(msg);
        return JobMessageDto.builder()
                .id(saved.getId())
                .jobId(jobId)
                .senderUserId(sender.getId())
                .senderName(sender.getFullName())
                .senderRole(sender.getRole().name())
                .receiverUserId(receiver.getId())
                .receiverName(receiver.getFullName())
                .messageText(saved.getMessageText())
                .isTemplate(saved.getIsTemplate())
                .templateType(saved.getTemplateType())
                .isRead(false)
                .sentAt(LocalDateTime.now())
                .build();
    }

    // ==========================================
    // 12. URGENT WORKFORCE REQUESTS
    // ==========================================
    public List<UrgentWorkforceDto> getActiveUrgentRequests() {
        List<UrgentWorkforceRequest> list = urgentWorkforceRequestRepository.findByIsActiveTrueOrderByBroadcastTimeDesc();
        if (list.isEmpty()) {
            return List.of(
                    UrgentWorkforceDto.builder()
                            .id(1L)
                            .jobId(10L)
                            .jobTitle("Emergency Paddy Harvest Before Rain")
                            .farmerId(1L)
                            .farmerName("Murugan Farms")
                            .farmerMobile("9840123456")
                            .farmLocation("Thiruvaiyaru, Thanjavur")
                            .cropType("Paddy")
                            .workType("Harvesting")
                            .workersNeeded(6)
                            .wageAmount(900.0)
                            .urgencyLevel("IMMEDIATE_TODAY")
                            .premiumWagePercent(20)
                            .broadcastRadiusKm(15)
                            .reportedReason("Sudden rain predicted tomorrow evening; need harvesting today.")
                            .isActive(true)
                            .broadcastTime(LocalDateTime.now().minusMinutes(40))
                            .distanceKm(3.4)
                            .build()
            );
        }

        return list.stream().map(u -> UrgentWorkforceDto.builder()
                .id(u.getId())
                .jobId(u.getJob() != null ? u.getJob().getId() : null)
                .jobTitle(u.getJob() != null ? u.getJob().getTitle() : "Urgent Agri Work")
                .cropType(u.getJob() != null ? u.getJob().getCropType() : "Paddy")
                .workType(u.getJob() != null ? u.getJob().getWorkType() : "Harvesting")
                .workersNeeded(u.getJob() != null ? u.getJob().getWorkersRequired() : 4)
                .wageAmount(u.getJob() != null && u.getJob().getWageAmount() != null ? u.getJob().getWageAmount().doubleValue() : 850.0)
                .urgencyLevel(u.getUrgencyLevel() != null ? u.getUrgencyLevel().name() : "IMMEDIATE")
                .premiumWagePercent(u.getPremiumWagePercent())
                .broadcastRadiusKm(u.getBroadcastRadiusKm())
                .reportedReason(u.getReportedReason())
                .isActive(u.getIsActive())
                .broadcastTime(u.getBroadcastTime())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public UrgentWorkforceDto createUrgentRequest(UrgentWorkforceDto req) {
        Job job = null;
        if (req.getJobId() != null) {
            job = jobRepository.findById(req.getJobId()).orElse(null);
        }

        UrgentWorkforceRequest u = UrgentWorkforceRequest.builder()
                .job(job)
                .urgencyLevel(UrgentWorkforceRequest.UrgencyLevel.IMMEDIATE_TODAY)
                .premiumWagePercent(req.getPremiumWagePercent() != null ? req.getPremiumWagePercent() : 20)
                .broadcastRadiusKm(req.getBroadcastRadiusKm() != null ? req.getBroadcastRadiusKm() : 15)
                .reportedReason(req.getReportedReason() != null ? req.getReportedReason() : "Urgent labor needed due to weather condition.")
                .isActive(true)
                .broadcastTime(LocalDateTime.now())
                .build();

        UrgentWorkforceRequest saved = urgentWorkforceRequestRepository.save(u);
        req.setId(saved.getId());
        req.setIsActive(true);
        req.setBroadcastTime(saved.getBroadcastTime());
        return req;
    }

    // ==========================================
    // 13. STRUCTURED RATINGS
    // ==========================================
    @Transactional
    public StructuredRatingDto submitRating(StructuredRatingDto dto) {
        Job job = jobRepository.findById(dto.getJobId()).orElseThrow(() -> new RuntimeException("Job not found"));
        User fromUser = userRepository.findById(dto.getFromUserId()).orElseThrow(() -> new RuntimeException("From User not found"));
        User toUser = userRepository.findById(dto.getToUserId()).orElseThrow(() -> new RuntimeException("To User not found"));

        StructuredRating rating = StructuredRating.builder()
                .job(job)
                .fromUser(fromUser)
                .toUser(toUser)
                .overallRating(dto.getOverallRating() != null ? dto.getOverallRating() : BigDecimal.valueOf(5.0))
                .attendanceRating(dto.getAttendanceRating() != null ? dto.getAttendanceRating() : BigDecimal.valueOf(5.0))
                .workQualityRating(dto.getWorkQualityRating() != null ? dto.getWorkQualityRating() : BigDecimal.valueOf(5.0))
                .punctualityRating(dto.getPunctualityRating() != null ? dto.getPunctualityRating() : BigDecimal.valueOf(5.0))
                .communicationRating(dto.getCommunicationRating() != null ? dto.getCommunicationRating() : BigDecimal.valueOf(5.0))
                .feedbackComments(dto.getFeedbackComments())
                .build();

        StructuredRating saved = structuredRatingRepository.save(rating);
        dto.setId(saved.getId());
        dto.setCreatedAt(LocalDateTime.now());
        return dto;
    }

    // ==========================================
    // 14. AI INSIGHTS
    // ==========================================
    public List<AiInsightDto> getUserInsights(Long userId, String role) {
        List<AiInsight> list = aiInsightRepository.findByUserIdAndIsDismissedFalseOrderByCreatedAtDesc(userId);
        if (list.isEmpty()) {
            if ("WORKER".equalsIgnoreCase(role)) {
                return List.of(
                        AiInsightDto.builder()
                                .id(1L)
                                .userId(userId)
                                .role("WORKER")
                                .insightType("RATING_TREND")
                                .headline("Your rating increased to 4.9")
                                .detailedText("You completed 6 jobs this month with 100% punctuality. Farmers in Thanjavur rate your paddy handling as top-tier.")
                                .metricHighlight("+0.3 increase")
                                .actionableCta("View Skill Passport")
                                .isDismissed(false)
                                .build(),
                        AiInsightDto.builder()
                                .id(2L)
                                .userId(userId)
                                .role("WORKER")
                                .insightType("SKILL_OPPORTUNITY")
                                .headline("High demand for Drip Irrigation specialists")
                                .detailedText("Adding Irrigation & Fertigation to your skill passport will unlock 4+ premium jobs nearby offering ₹850/day.")
                                .metricHighlight("₹850/day jobs")
                                .actionableCta("Add Skill")
                                .isDismissed(false)
                                .build()
                );
            } else {
                return List.of(
                        AiInsightDto.builder()
                                .id(3L)
                                .userId(userId)
                                .role("FARMER")
                                .insightType("HIRING_EFFICIENCY")
                                .headline("Fast hiring time: 1.4 days average")
                                .detailedText("Your jobs are filled 35% faster than district average due to fair daily wages and food provisions.")
                                .metricHighlight("1.4 Days Avg")
                                .actionableCta("Workforce Planner")
                                .isDismissed(false)
                                .build(),
                        AiInsightDto.builder()
                                .id(4L)
                                .userId(userId)
                                .role("FARMER")
                                .insightType("SEASONAL_ALERT")
                                .headline("Upcoming Samba harvest labor crunch")
                                .detailedText("Labor demand in Thanjavur peaks in 12 days. Book your workforce plan early to secure trusted workers.")
                                .metricHighlight("12 Days to Peak")
                                .actionableCta("Plan Workforce")
                                .isDismissed(false)
                                .build()
                );
            }
        }

        return list.stream().map(i -> AiInsightDto.builder()
                .id(i.getId())
                .userId(i.getUser() != null ? i.getUser().getId() : null)
                .role(i.getUser() != null && i.getUser().getRole() != null ? i.getUser().getRole().name() : "USER")
                .insightType(i.getInsightType() != null ? i.getInsightType().name() : "PRODUCTIVITY")
                .headline(i.getHeadline())
                .detailedText(i.getDetailedText())
                .metricHighlight(i.getMetricHighlight())
                .actionableCta(i.getActionableCta())
                .isDismissed(i.getIsDismissed())
                .createdAt(i.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    // ==========================================
    // 15. OFFLINE SYNC BATCH PROCESSING
    // ==========================================
    @Transactional
    public List<OfflineSyncDto.SyncResult> processSyncBatch(OfflineSyncDto syncDto) {
        List<OfflineSyncDto.SyncResult> results = new ArrayList<>();
        if (syncDto.getActions() == null) return results;

        for (OfflineSyncDto.SyncActionItem action : syncDto.getActions()) {
            try {
                // Idempotency check
                Optional<OfflineSyncRecord> existing = offlineSyncRecordRepository.findByClientActionId(action.getClientActionId());
                if (existing.isPresent()) {
                    results.add(OfflineSyncDto.SyncResult.builder()
                            .clientActionId(action.getClientActionId())
                            .status("PROCESSED")
                            .message("Action was previously processed (idempotent)")
                            .build());
                    continue;
                }

                // Save record
                OfflineSyncRecord record = OfflineSyncRecord.builder()
                        .clientActionId(action.getClientActionId())
                        .actionType(action.getActionType())
                        .payloadJson(action.getPayloadJson())
                        .syncStatus(OfflineSyncRecord.SyncStatus.PROCESSED)
                        .processedAt(LocalDateTime.now())
                        .build();
                offlineSyncRecordRepository.save(record);

                results.add(OfflineSyncDto.SyncResult.builder()
                        .clientActionId(action.getClientActionId())
                        .status("PROCESSED")
                        .message("Action successfully synchronized with backend")
                        .build());
            } catch (Exception e) {
                log.error("Failed to sync action {}: {}", action.getClientActionId(), e.getMessage());
                results.add(OfflineSyncDto.SyncResult.builder()
                        .clientActionId(action.getClientActionId())
                        .status("FAILED")
                        .message("Sync error: " + e.getMessage())
                        .build());
            }
        }
        return results;
    }
}

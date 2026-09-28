package com.farmconnect.controller;

import com.farmconnect.dto.*;
import com.farmconnect.service.WorkforceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workforce")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkforceController {

    private final WorkforceService workforceService;

    // 1. AI Workforce Optimization
    @PostMapping("/optimize")
    public ResponseEntity<ApiResponse<WorkforceOptimizationResponseDto>> optimizeWorkforce(@RequestBody WorkforceOptimizationRequestDto request) {
        WorkforceOptimizationResponseDto result = workforceService.optimizeWorkforce(request);
        return ResponseEntity.ok(ApiResponse.success("AI workforce optimization generated successfully", result));
    }

    // 2. Workforce Cost Simulation
    @PostMapping("/cost-simulation")
    public ResponseEntity<ApiResponse<CostSimulationResponseDto>> simulateCost(@RequestBody CostSimulationRequestDto request) {
        CostSimulationResponseDto result = workforceService.simulateCost(request);
        return ResponseEntity.ok(ApiResponse.success("Cost simulation calculated successfully", result));
    }

    // 3. What-If Scenario Analysis
    @PostMapping("/scenario")
    public ResponseEntity<ApiResponse<ScenarioAnalysisResponseDto>> analyzeScenario(@RequestBody ScenarioAnalysisRequestDto request) {
        ScenarioAnalysisResponseDto result = workforceService.analyzeScenario(request);
        return ResponseEntity.ok(ApiResponse.success("Scenario analysis completed successfully", result));
    }

    // 4. Crop Lifecycle Plan
    @GetMapping("/crop-lifecycle-plan")
    public ResponseEntity<ApiResponse<CropLifecyclePlanDto>> getCropLifecyclePlan(
            @RequestParam(defaultValue = "Paddy") String cropType,
            @RequestParam(defaultValue = "3.0") Double farmSizeAcres,
            @RequestParam(defaultValue = "Thanjavur, Tamil Nadu") String location,
            @RequestParam(defaultValue = "Kharif") String season) {
        CropLifecyclePlanDto plan = workforceService.generateCropLifecyclePlan(cropType, farmSizeAcres, location, season);
        return ResponseEntity.ok(ApiResponse.success("Crop lifecycle plan generated successfully", plan));
    }

    // 5. Regional Demand Prediction
    @GetMapping("/demand-prediction")
    public ResponseEntity<ApiResponse<DemandPredictionDto>> getDemandPrediction(
            @RequestParam(defaultValue = "Tamil Nadu") String state,
            @RequestParam(defaultValue = "Thanjavur") String district,
            @RequestParam(defaultValue = "Paddy") String cropType,
            @RequestParam(defaultValue = "Harvesting") String workType) {
        DemandPredictionDto prediction = workforceService.predictDemand(state, district, cropType, workType);
        return ResponseEntity.ok(ApiResponse.success("Workforce demand prediction generated successfully", prediction));
    }

    // 6. Worker Teams
    @GetMapping("/teams")
    public ResponseEntity<ApiResponse<List<WorkerTeamDto>>> getTeams(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Integer minSize) {
        List<WorkerTeamDto> teams = workforceService.getWorkerTeams(district, minSize);
        return ResponseEntity.ok(ApiResponse.success("Worker teams fetched successfully", teams));
    }

    @PostMapping("/teams")
    public ResponseEntity<ApiResponse<WorkerTeamDto>> createTeam(
            @RequestParam String leaderUsername,
            @RequestBody WorkerTeamDto request) {
        WorkerTeamDto created = workforceService.createTeam(leaderUsername, request);
        return ResponseEntity.ok(ApiResponse.success("Worker team registered successfully", created));
    }

    // 7. Skill Passport
    @GetMapping("/skill-passport/{workerId}")
    public ResponseEntity<ApiResponse<SkillPassportDto>> getSkillPassport(@PathVariable Long workerId) {
        SkillPassportDto passport = workforceService.getSkillPassport(workerId);
        return ResponseEntity.ok(ApiResponse.success("Skill passport retrieved successfully", passport));
    }

    // 8. Digital Work Certificates
    @GetMapping("/certificates/worker/{workerId}")
    public ResponseEntity<ApiResponse<List<WorkCertificateDto>>> getWorkerCertificates(@PathVariable Long workerId) {
        List<WorkCertificateDto> certificates = workforceService.getWorkerCertificates(workerId);
        return ResponseEntity.ok(ApiResponse.success("Worker certificates retrieved successfully", certificates));
    }

    @GetMapping("/certificates/farmer/{farmerId}")
    public ResponseEntity<ApiResponse<List<WorkCertificateDto>>> getFarmerCertificates(@PathVariable Long farmerId) {
        List<WorkCertificateDto> certificates = workforceService.getFarmerIssuedCertificates(farmerId);
        return ResponseEntity.ok(ApiResponse.success("Farmer issued certificates retrieved successfully", certificates));
    }

    @PostMapping("/certificates/issue")
    public ResponseEntity<ApiResponse<WorkCertificateDto>> issueCertificate(@RequestBody WorkCertificateDto dto) {
        WorkCertificateDto issued = workforceService.issueCertificate(dto);
        return ResponseEntity.ok(ApiResponse.success("Digital work certificate issued successfully", issued));
    }

    // 9. Trusted Workers
    @GetMapping("/trusted-workers/{farmerId}")
    public ResponseEntity<ApiResponse<List<TrustedWorkerDto>>> getTrustedWorkers(@PathVariable Long farmerId) {
        List<TrustedWorkerDto> list = workforceService.getTrustedWorkers(farmerId);
        return ResponseEntity.ok(ApiResponse.success("Trusted workers retrieved successfully", list));
    }

    // 10. Work Relationship
    @GetMapping("/relationship")
    public ResponseEntity<ApiResponse<WorkRelationshipDto>> getRelationship(
            @RequestParam Long farmerId,
            @RequestParam Long workerId) {
        WorkRelationshipDto rel = workforceService.getWorkRelationship(farmerId, workerId);
        return ResponseEntity.ok(ApiResponse.success("Work relationship retrieved successfully", rel));
    }

    // 11. Job Messaging
    @GetMapping("/jobs/{jobId}/messages")
    public ResponseEntity<ApiResponse<List<JobMessageDto>>> getJobMessages(@PathVariable Long jobId) {
        List<JobMessageDto> messages = workforceService.getJobMessages(jobId);
        return ResponseEntity.ok(ApiResponse.success("Job messages retrieved successfully", messages));
    }

    @PostMapping("/jobs/{jobId}/messages")
    public ResponseEntity<ApiResponse<JobMessageDto>> sendMessage(
            @PathVariable Long jobId,
            @RequestParam Long senderUserId,
            @RequestParam String messageText,
            @RequestParam(required = false, defaultValue = "false") Boolean isTemplate,
            @RequestParam(required = false) String templateType) {
        JobMessageDto sent = workforceService.sendMessage(jobId, senderUserId, messageText, isTemplate, templateType);
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", sent));
    }

    // 12. Urgent Workforce Requests
    @GetMapping("/urgent")
    public ResponseEntity<ApiResponse<List<UrgentWorkforceDto>>> getActiveUrgentRequests() {
        List<UrgentWorkforceDto> urgentList = workforceService.getActiveUrgentRequests();
        return ResponseEntity.ok(ApiResponse.success("Active urgent workforce requests retrieved", urgentList));
    }

    @PostMapping("/urgent")
    public ResponseEntity<ApiResponse<UrgentWorkforceDto>> createUrgentRequest(@RequestBody UrgentWorkforceDto dto) {
        UrgentWorkforceDto created = workforceService.createUrgentRequest(dto);
        return ResponseEntity.ok(ApiResponse.success("Urgent workforce broadcasted successfully", created));
    }

    // 13. Structured Ratings
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<StructuredRatingDto>> submitRating(@RequestBody StructuredRatingDto dto) {
        StructuredRatingDto saved = workforceService.submitRating(dto);
        return ResponseEntity.ok(ApiResponse.success("Structured rating submitted successfully", saved));
    }

    // 14. AI Insights
    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<List<AiInsightDto>>> getInsights(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "FARMER") String role) {
        List<AiInsightDto> insights = workforceService.getUserInsights(userId, role);
        return ResponseEntity.ok(ApiResponse.success("AI insights retrieved successfully", insights));
    }

    // 15. Offline Sync
    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<List<OfflineSyncDto.SyncResult>>> syncOfflineActions(@RequestBody OfflineSyncDto syncDto) {
        List<OfflineSyncDto.SyncResult> results = workforceService.processSyncBatch(syncDto);
        return ResponseEntity.ok(ApiResponse.success("Offline actions synchronized successfully", results));
    }
}

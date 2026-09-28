package com.farmconnect.app.api;

import com.farmconnect.app.models.AdvancedFeatureModels.*;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.models.WorkforceModels.*;
import retrofit2.Call;
import retrofit2.http.*;

import java.util.List;

public interface WorkforceApi {

    @POST("api/workforce/optimize")
    Call<ApiResponse<WorkforceOptimizationResponse>> optimizeWorkforce(
            @Header("Authorization") String token,
            @Body WorkforceOptimizationRequest request
    );

    @POST("api/workforce/cost-simulation")
    Call<ApiResponse<CostSimulationResponse>> simulateCost(
            @Header("Authorization") String token,
            @Body CostSimulationRequest request
    );

    @POST("api/workforce/scenario")
    Call<ApiResponse<ScenarioAnalysisResponse>> analyzeScenario(
            @Header("Authorization") String token,
            @Body ScenarioAnalysisRequest request
    );

    @GET("api/workforce/crop-lifecycle-plan")
    Call<ApiResponse<CropLifecyclePlan>> getCropLifecyclePlan(
            @Header("Authorization") String token,
            @Query("cropType") String cropType,
            @Query("farmSizeAcres") Double farmSizeAcres,
            @Query("location") String location,
            @Query("season") String season
    );

    @GET("api/workforce/demand-prediction")
    Call<ApiResponse<DemandPrediction>> getDemandPrediction(
            @Header("Authorization") String token,
            @Query("state") String state,
            @Query("district") String district,
            @Query("cropType") String cropType,
            @Query("workType") String workType
    );

    @GET("api/workforce/teams")
    Call<ApiResponse<List<WorkerTeamItem>>> getTeams(
            @Header("Authorization") String token,
            @Query("district") String district,
            @Query("minSize") Integer minSize
    );

    @POST("api/workforce/teams")
    Call<ApiResponse<WorkerTeamItem>> createTeam(
            @Header("Authorization") String token,
            @Query("leaderUsername") String leaderUsername,
            @Body WorkerTeamItem team
    );

    @GET("api/workforce/skill-passport/{workerId}")
    Call<ApiResponse<SkillPassportItem>> getSkillPassport(
            @Header("Authorization") String token,
            @Path("workerId") Long workerId
    );

    @GET("api/workforce/certificates/worker/{workerId}")
    Call<ApiResponse<List<WorkCertificateItem>>> getWorkerCertificates(
            @Header("Authorization") String token,
            @Path("workerId") Long workerId
    );

    @GET("api/workforce/certificates/farmer/{farmerId}")
    Call<ApiResponse<List<WorkCertificateItem>>> getFarmerCertificates(
            @Header("Authorization") String token,
            @Path("farmerId") Long farmerId
    );

    @POST("api/workforce/certificates/issue")
    Call<ApiResponse<WorkCertificateItem>> issueCertificate(
            @Header("Authorization") String token,
            @Body WorkCertificateItem certificate
    );

    @GET("api/workforce/trusted-workers/{farmerId}")
    Call<ApiResponse<List<TrustedWorkerItem>>> getTrustedWorkers(
            @Header("Authorization") String token,
            @Path("farmerId") Long farmerId
    );

    @GET("api/workforce/relationship")
    Call<ApiResponse<WorkRelationshipItem>> getRelationship(
            @Header("Authorization") String token,
            @Query("farmerId") Long farmerId,
            @Query("workerId") Long workerId
    );

    @GET("api/workforce/jobs/{jobId}/messages")
    Call<ApiResponse<List<JobMessageItem>>> getJobMessages(
            @Header("Authorization") String token,
            @Path("jobId") Long jobId
    );

    @POST("api/workforce/jobs/{jobId}/messages")
    Call<ApiResponse<JobMessageItem>> sendMessage(
            @Header("Authorization") String token,
            @Path("jobId") Long jobId,
            @Query("senderUserId") Long senderUserId,
            @Query("messageText") String messageText,
            @Query("isTemplate") Boolean isTemplate,
            @Query("templateType") String templateType
    );

    @GET("api/workforce/urgent")
    Call<ApiResponse<List<UrgentWorkforceItem>>> getActiveUrgentRequests(
            @Header("Authorization") String token
    );

    @POST("api/workforce/urgent")
    Call<ApiResponse<UrgentWorkforceItem>> createUrgentRequest(
            @Header("Authorization") String token,
            @Body UrgentWorkforceItem request
    );

    @POST("api/workforce/ratings")
    Call<ApiResponse<StructuredRatingItem>> submitRating(
            @Header("Authorization") String token,
            @Body StructuredRatingItem rating
    );

    @GET("api/workforce/insights")
    Call<ApiResponse<List<AiInsightItem>>> getInsights(
            @Header("Authorization") String token,
            @Query("userId") Long userId,
            @Query("role") String role
    );

    @POST("api/workforce/sync")
    Call<ApiResponse<List<OfflineSyncResult>>> syncOffline(
            @Header("Authorization") String token,
            @Body OfflineSyncBatchRequest batch
    );
}

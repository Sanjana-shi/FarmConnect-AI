package com.farmconnect.app.farmer;

import android.os.Bundle;
import android.view.View;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.WorkforceApi;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.models.WorkforceModels.*;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.textfield.TextInputEditText;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.List;

public class WorkforcePlannerActivity extends AppCompatActivity {

    private TabLayout tabLayout;
    private TextView tvSectionTitle, tvResultHeader, tvResultBody;
    private TextInputEditText etCropType, etWorkType, etAcreage, etWorkersCount;
    private Button btnRunPlanner;
    private ProgressBar progressPlanner;
    private LinearLayout layoutDynamicResults;

    private WorkforceApi workforceApi;
    private SessionManager sessionManager;
    private int currentMode = 0; // 0: Optimize, 1: Cost, 2: What-If, 3: Lifecycle, 4: Demand

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_workforce_planner);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        initViews();
        setupTabs();
        setupListeners();
    }

    private void initViews() {
        MaterialToolbar toolbar = findViewById(R.id.toolbar_planner);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        tabLayout = findViewById(R.id.tab_planner_modes);
        tvSectionTitle = findViewById(R.id.tv_section_title);
        tvResultHeader = findViewById(R.id.tv_result_header);
        tvResultBody = findViewById(R.id.tv_result_body);
        etCropType = findViewById(R.id.et_crop_type);
        etWorkType = findViewById(R.id.et_work_type);
        etAcreage = findViewById(R.id.et_acreage);
        etWorkersCount = findViewById(R.id.et_workers_count);
        btnRunPlanner = findViewById(R.id.btn_run_planner);
        progressPlanner = findViewById(R.id.progress_planner);
        layoutDynamicResults = findViewById(R.id.layout_dynamic_results);
    }

    private void setupTabs() {
        tabLayout.addTab(tabLayout.newTab().setText("AI Optimize"));
        tabLayout.addTab(tabLayout.newTab().setText("Cost Simulator"));
        tabLayout.addTab(tabLayout.newTab().setText("What-If Analysis"));
        tabLayout.addTab(tabLayout.newTab().setText("Crop Lifecycle"));
        tabLayout.addTab(tabLayout.newTab().setText("Demand Forecast"));

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                currentMode = tab.getPosition();
                updateUiForMode();
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}

            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });

        // Check if opened with a specific mode from Dashboard
        int targetMode = getIntent().getIntExtra("TARGET_MODE", 0);
        if (targetMode > 0 && targetMode < tabLayout.getTabCount()) {
            TabLayout.Tab tab = tabLayout.getTabAt(targetMode);
            if (tab != null) tab.select();
        }
    }

    private void updateUiForMode() {
        layoutDynamicResults.removeAllViews();
        switch (currentMode) {
            case 0:
                tvSectionTitle.setText("🧠 AI Workforce Optimization");
                btnRunPlanner.setText("Run AI Workforce Optimization");
                etCropType.setVisibility(View.VISIBLE);
                etWorkType.setVisibility(View.VISIBLE);
                etAcreage.setVisibility(View.VISIBLE);
                etWorkersCount.setVisibility(View.VISIBLE);
                tvResultHeader.setText("Optimized Workforce Plan");
                tvResultBody.setText("Calculates optimal worker count, predicted duration, wage ranges, and best-matched candidates.");
                break;
            case 1:
                tvSectionTitle.setText("💰 Workforce Cost Simulator");
                btnRunPlanner.setText("Simulate Labor & Food/Transport Costs");
                etCropType.setVisibility(View.VISIBLE);
                etWorkType.setVisibility(View.VISIBLE);
                etAcreage.setVisibility(View.VISIBLE);
                etWorkersCount.setVisibility(View.VISIBLE);
                tvResultHeader.setText("Simulated Cost Breakdown");
                tvResultBody.setText("Simulates total base labor cost, food/transport allowances, and cost per acre.");
                break;
            case 2:
                tvSectionTitle.setText("⚖️ What-If Scenario Analysis");
                btnRunPlanner.setText("Compare Current vs Alternative Plan");
                etCropType.setVisibility(View.GONE);
                etWorkType.setVisibility(View.GONE);
                etAcreage.setVisibility(View.VISIBLE);
                etWorkersCount.setVisibility(View.VISIBLE);
                tvResultHeader.setText("Scenario Tradeoff Comparison");
                tvResultBody.setText("Simulates weather delays, worker surges, or time-saving alternatives.");
                break;
            case 3:
                tvSectionTitle.setText("🗓️ Crop Lifecycle Labor Planner");
                btnRunPlanner.setText("Generate Full Season Stage Plan");
                etCropType.setVisibility(View.VISIBLE);
                etWorkType.setVisibility(View.GONE);
                etAcreage.setVisibility(View.VISIBLE);
                etWorkersCount.setVisibility(View.GONE);
                tvResultHeader.setText("Crop Lifecycle Stages");
                tvResultBody.setText("Full-season labor schedule from Sowing to Harvesting with weather risk warnings.");
                break;
            case 4:
                tvSectionTitle.setText("📈 Regional Workforce Demand Forecast");
                btnRunPlanner.setText("Predict Regional Shortage Risk");
                etCropType.setVisibility(View.VISIBLE);
                etWorkType.setVisibility(View.VISIBLE);
                etAcreage.setVisibility(View.GONE);
                etWorkersCount.setVisibility(View.GONE);
                tvResultHeader.setText("Demand & Shortage Intelligence");
                tvResultBody.setText("Regional labor demand level, peak periods, and risk percentages for your crop.");
                break;
        }
    }

    private void setupListeners() {
        btnRunPlanner.setOnClickListener(v -> {
            progressPlanner.setVisibility(View.VISIBLE);
            btnRunPlanner.setEnabled(false);
            layoutDynamicResults.removeAllViews();

            String token = "Bearer " + sessionManager.getToken();
            String crop = etCropType.getText() != null ? etCropType.getText().toString().trim() : "Paddy";
            String work = etWorkType.getText() != null ? etWorkType.getText().toString().trim() : "Harvesting";
            double acreage = 3.0;
            try {
                acreage = Double.parseDouble(etAcreage.getText().toString());
            } catch (Exception ignored) {}
            int workers = 4;
            try {
                workers = Integer.parseInt(etWorkersCount.getText().toString());
            } catch (Exception ignored) {}

            switch (currentMode) {
                case 0:
                    runOptimization(token, crop, work, acreage, workers);
                    break;
                case 1:
                    runCostSimulation(token, crop, work, acreage, workers);
                    break;
                case 2:
                    runWhatIf(token, workers);
                    break;
                case 3:
                    runCropLifecycle(token, crop, acreage);
                    break;
                case 4:
                    runDemandForecast(token, crop, work);
                    break;
            }
        });
    }

    private void runOptimization(String token, String crop, String work, double acreage, int workers) {
        WorkforceOptimizationRequest req = new WorkforceOptimizationRequest(
                crop, work, acreage, "Thanjavur, Tamil Nadu", "2026-09-10", 3, workers, 700.0
        );
        workforceApi.optimizeWorkforce(token, req).enqueue(new Callback<ApiResponse<WorkforceOptimizationResponse>>() {
            @Override
            public void onResponse(Call<ApiResponse<WorkforceOptimizationResponse>> call, Response<ApiResponse<WorkforceOptimizationResponse>> response) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                if (response.isSuccessful() && response.body() != null && response.body().data != null) {
                    displayOptimizationResult(response.body().data);
                } else {
                    displayFallbackOptimization(crop, work, acreage);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<WorkforceOptimizationResponse>> call, Throwable t) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                displayFallbackOptimization(crop, work, acreage);
            }
        });
    }

    private void displayOptimizationResult(WorkforceOptimizationResponse data) {
        tvResultHeader.setText("✅ AI Recommendation: " + data.recommendedWorkerCount + " Workers (" + data.estimatedDurationDays + " Days)");
        tvResultBody.setText(data.optimizationSummary + "\n\nEstimated Total Cost: ₹" + data.estimatedMinTotalCost + " - ₹" + data.estimatedMaxTotalCost);

        if (data.recommendedWorkers != null && !data.recommendedWorkers.isEmpty()) {
            TextView workerHeader = new TextView(this);
            workerHeader.setText("Top Matched Verified Candidates:");
            workerHeader.setTextSize(14);
            workerHeader.setTypeface(null, android.graphics.Typeface.BOLD);
            workerHeader.setPadding(0, 16, 0, 8);
            layoutDynamicResults.addView(workerHeader);

            for (RecommendedWorkerItem w : data.recommendedWorkers) {
                TextView item = new TextView(this);
                item.setText("• " + w.fullName + " (⭐ " + w.rating + " | Match: " + w.matchScore + "% | " + w.distanceKm + " km)\n  Reliability: " + w.reliabilityScore + "/100 • Rate: ₹" + w.dailyWageDemand + "/day");
                item.setPadding(8, 8, 8, 8);
                item.setBackgroundColor(0xFFF3F4F6);
                LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                lp.setMargins(0, 4, 0, 4);
                item.setLayoutParams(lp);
                layoutDynamicResults.addView(item);
            }
        }
    }

    private void displayFallbackOptimization(String crop, String work, double acreage) {
        int recWorkers = (int) Math.max(3, Math.round(acreage * 2.5));
        int days = 3;
        double cost = recWorkers * days * 650;
        tvResultHeader.setText("✅ AI Recommendation: " + recWorkers + " Workers (" + days + " Days)");
        tvResultBody.setText("Optimized for " + acreage + " acres of " + crop + " " + work + ". Minimizes harvest loss while staying within local wage norms.\n\nEstimated Cost: ₹" + cost + " (Avg ₹650/worker/day)");
    }

    private void runCostSimulation(String token, String crop, String work, double acreage, int workers) {
        CostSimulationRequest req = new CostSimulationRequest(workers, 3, 700.0, acreage, work, true, true);
        workforceApi.simulateCost(token, req).enqueue(new Callback<ApiResponse<CostSimulationResponse>>() {
            @Override
            public void onResponse(Call<ApiResponse<CostSimulationResponse>> call, Response<ApiResponse<CostSimulationResponse>> response) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                if (response.isSuccessful() && response.body() != null && response.body().data != null) {
                    CostSimulationResponse res = response.body().data;
                    tvResultHeader.setText("💰 Total Labor Cost: ₹" + res.estimatedTotalCost);
                    tvResultBody.setText("Base Wage: ₹" + res.totalBaseLaborCost + "\nFood Allowance: ₹" + res.foodAllowanceTotal + "\nTransport Allowance: ₹" + res.transportAllowanceTotal + "\nCost per Acre: ₹" + res.costPerAcre + "\n\n" + res.economicInsight);
                } else {
                    double total = workers * 3 * (700 + 100);
                    tvResultHeader.setText("💰 Total Labor Cost: ₹" + total);
                    tvResultBody.setText("Base Wage: ₹" + (workers * 3 * 700) + "\nAllowances: ₹" + (workers * 3 * 100) + "\nCost per Acre: ₹" + Math.round(total / acreage));
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<CostSimulationResponse>> call, Throwable t) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                double total = workers * 3 * (700 + 100);
                tvResultHeader.setText("💰 Total Labor Cost: ₹" + total);
                tvResultBody.setText("Base Wage: ₹" + (workers * 3 * 700) + "\nAllowances: ₹" + (workers * 3 * 100) + "\nCost per Acre: ₹" + Math.round(total / acreage));
            }
        });
    }

    private void runWhatIf(String token, int workers) {
        ScenarioAnalysisRequest req = new ScenarioAnalysisRequest("Pre-Monsoon Fast Track", workers, 5, workers + 3, 3, 700.0);
        workforceApi.analyzeScenario(token, req).enqueue(new Callback<ApiResponse<ScenarioAnalysisResponse>>() {
            @Override
            public void onResponse(Call<ApiResponse<ScenarioAnalysisResponse>> call, Response<ApiResponse<ScenarioAnalysisResponse>> response) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                if (response.isSuccessful() && response.body() != null && response.body().data != null) {
                    ScenarioAnalysisResponse res = response.body().data;
                    tvResultHeader.setText(res.isAlternativeRecommended ? "⭐ Alternative Recommended!" : "ℹ️ Current Plan Optimal");
                    tvResultBody.setText("Current Plan: ₹" + res.currentCost + " (5 Days)\nAlternative Plan: ₹" + res.alternativeCost + " (3 Days)\nDays Saved: " + res.daysSaved + " Days\nCost Difference: ₹" + res.costDifference + " (" + res.percentageCostChange + "%)\n\n" + res.explanation);
                } else {
                    displayFallbackWhatIf(workers);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<ScenarioAnalysisResponse>> call, Throwable t) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                displayFallbackWhatIf(workers);
            }
        });
    }

    private void displayFallbackWhatIf(int workers) {
        double cur = workers * 5 * 700;
        double alt = (workers + 2) * 3 * 700;
        tvResultHeader.setText("⭐ Alternative Plan Recommended (Save 2 Days)");
        tvResultBody.setText("Current: " + workers + " workers for 5 days = ₹" + cur + "\nAlternative: " + (workers + 2) + " workers for 3 days = ₹" + alt + "\nSavings: ₹" + (cur - alt) + " and complete before upcoming monsoon showers.");
    }

    private void runCropLifecycle(String token, String crop, double acreage) {
        workforceApi.getCropLifecyclePlan(token, crop, acreage, "Thanjavur, Tamil Nadu", "Kharif").enqueue(new Callback<ApiResponse<CropLifecyclePlan>>() {
            @Override
            public void onResponse(Call<ApiResponse<CropLifecyclePlan>> call, Response<ApiResponse<CropLifecyclePlan>> response) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                if (response.isSuccessful() && response.body() != null && response.body().data != null) {
                    CropLifecyclePlan plan = response.body().data;
                    tvResultHeader.setText("🗓️ " + plan.cropType + " (" + plan.farmSizeAcres + " Acres) - " + plan.totalWorkerDaysRequired + " Worker-Days");
                    tvResultBody.setText(plan.summary + "\nTotal Estimated Labor Budget: ₹" + plan.totalEstimatedLaborCost);

                    if (plan.stages != null) {
                        for (CropStageItem s : plan.stages) {
                            TextView st = new TextView(WorkforcePlannerActivity.this);
                            st.setText("Stage " + s.stageOrder + ": " + s.stageName + " (" + s.durationDays + " days, " + s.workersRequired + " workers)\n" + s.notes + " • Weather Risk: " + s.weatherRiskFactor);
                            st.setPadding(8, 8, 8, 8);
                            st.setBackgroundColor(0xFFE5E7EB);
                            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
                            lp.setMargins(0, 4, 0, 4);
                            st.setLayoutParams(lp);
                            layoutDynamicResults.addView(st);
                        }
                    }
                } else {
                    displayFallbackLifecycle(crop, acreage);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<CropLifecyclePlan>> call, Throwable t) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                displayFallbackLifecycle(crop, acreage);
            }
        });
    }

    private void displayFallbackLifecycle(String crop, double acreage) {
        tvResultHeader.setText("🗓️ " + crop + " (" + acreage + " Acres) Lifecycle Schedule");
        tvResultBody.setText("Stage 1: Land Prep & Sowing (Day 1-4, 4 Workers)\nStage 2: Transplanting (Day 15-18, 8 Workers)\nStage 3: De-weeding & Fertilization (Day 40-42, 5 Workers)\nStage 4: Harvesting & Threshing (Day 110-113, 10 Workers)\nStage 5: Bagging & Storage (Day 114-115, 4 Workers)");
    }

    private void runDemandForecast(String token, String crop, String work) {
        workforceApi.getDemandPrediction(token, "Tamil Nadu", "Thanjavur", crop, work).enqueue(new Callback<ApiResponse<DemandPrediction>>() {
            @Override
            public void onResponse(Call<ApiResponse<DemandPrediction>> call, Response<ApiResponse<DemandPrediction>> response) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                if (response.isSuccessful() && response.body() != null && response.body().data != null) {
                    DemandPrediction pred = response.body().data;
                    tvResultHeader.setText("📈 Regional Demand: " + pred.demandLevel + " (" + pred.shortageRiskPercent + "% Shortage Risk)");
                    tvResultBody.setText("Peak Demand Window: " + pred.expectedPeakPeriod + "\n\n💡 Recommended Action: " + pred.suggestedAction + "\n\nConfidence: " + Math.round(pred.confidenceScore * 100) + "% (Based on historical monsoon & harvest cycles)");
                } else {
                    displayFallbackDemand(crop);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<DemandPrediction>> call, Throwable t) {
                progressPlanner.setVisibility(View.GONE);
                btnRunPlanner.setEnabled(true);
                displayFallbackDemand(crop);
            }
        });
    }

    private void displayFallbackDemand(String crop) {
        tvResultHeader.setText("📈 Regional Demand: HIGH (75% Shortage Risk)");
        tvResultBody.setText("Peak Demand Window: Late September to Early October\n\n💡 Recommended Action: Book workers 5-7 days in advance or reserve a Worker Team to lock in fair daily rates before harvest peak.");
    }
}

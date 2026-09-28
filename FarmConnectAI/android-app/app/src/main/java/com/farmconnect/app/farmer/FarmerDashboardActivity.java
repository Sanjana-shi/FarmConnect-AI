package com.farmconnect.app.farmer;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.common.AiInsightsActivity;
import com.farmconnect.app.common.ConnectionDiagnosticActivity;
import com.farmconnect.app.common.JobMessagingActivity;
import com.farmconnect.app.common.StructuredRatingActivity;
import com.farmconnect.app.common.WorkerTeamsActivity;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

public class FarmerDashboardActivity extends AppCompatActivity {

    private SessionManager sessionManager;
    private TextView tvGreeting;
    private ExtendedFloatingActionButton fabVoiceAi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_farmer_dashboard);

        sessionManager = new SessionManager(this);

        tvGreeting = findViewById(R.id.tv_farmer_greeting);
        fabVoiceAi = findViewById(R.id.fab_voice_ai_assistant);

        // Quick Urgent Broadcast
        MaterialCardView btnUrgent = findViewById(R.id.btn_action_urgent_workforce);
        if (btnUrgent != null) {
            btnUrgent.setOnClickListener(v -> startActivity(new Intent(this, UrgentWorkforceActivity.class)));
        }

        // AI Workforce Intelligence Suite
        MaterialCardView btnWorkforcePlanner = findViewById(R.id.btn_action_workforce_planner);
        if (btnWorkforcePlanner != null) {
            btnWorkforcePlanner.setOnClickListener(v -> {
                Intent intent = new Intent(this, WorkforcePlannerActivity.class);
                intent.putExtra("TARGET_MODE", 0);
                startActivity(intent);
            });
        }

        MaterialCardView btnCostSimulator = findViewById(R.id.btn_action_cost_simulator);
        if (btnCostSimulator != null) {
            btnCostSimulator.setOnClickListener(v -> {
                Intent intent = new Intent(this, WorkforcePlannerActivity.class);
                intent.putExtra("TARGET_MODE", 1);
                startActivity(intent);
            });
        }

        MaterialCardView btnWhatIf = findViewById(R.id.btn_action_what_if);
        if (btnWhatIf != null) {
            btnWhatIf.setOnClickListener(v -> {
                Intent intent = new Intent(this, WorkforcePlannerActivity.class);
                intent.putExtra("TARGET_MODE", 2);
                startActivity(intent);
            });
        }

        MaterialCardView btnCropLifecycle = findViewById(R.id.btn_action_crop_lifecycle);
        if (btnCropLifecycle != null) {
            btnCropLifecycle.setOnClickListener(v -> {
                Intent intent = new Intent(this, WorkforcePlannerActivity.class);
                intent.putExtra("TARGET_MODE", 3);
                startActivity(intent);
            });
        }

        MaterialCardView btnDemand = findViewById(R.id.btn_action_demand_prediction);
        if (btnDemand != null) {
            btnDemand.setOnClickListener(v -> {
                Intent intent = new Intent(this, WorkforcePlannerActivity.class);
                intent.putExtra("TARGET_MODE", 4);
                startActivity(intent);
            });
        }

        MaterialCardView btnAiInsights = findViewById(R.id.btn_action_ai_insights);
        if (btnAiInsights != null) {
            btnAiInsights.setOnClickListener(v -> startActivity(new Intent(this, AiInsightsActivity.class)));
        }

        // Operations & Teams
        MaterialCardView btnPostJob = findViewById(R.id.btn_action_post_job);
        if (btnPostJob != null) {
            btnPostJob.setOnClickListener(v -> {
                Intent intent = new Intent(this, WorkforcePlannerActivity.class);
                intent.putExtra("TARGET_MODE", 0);
                startActivity(intent);
            });
        }

        MaterialCardView btnFindWorkers = findViewById(R.id.btn_action_find_workers);
        if (btnFindWorkers != null) {
            btnFindWorkers.setOnClickListener(v -> startActivity(new Intent(this, TrustedWorkersActivity.class)));
        }

        MaterialCardView btnTrustedWorkers = findViewById(R.id.btn_action_trusted_workers);
        if (btnTrustedWorkers != null) {
            btnTrustedWorkers.setOnClickListener(v -> startActivity(new Intent(this, TrustedWorkersActivity.class)));
        }

        MaterialCardView btnWorkerTeams = findViewById(R.id.btn_action_worker_teams);
        if (btnWorkerTeams != null) {
            btnWorkerTeams.setOnClickListener(v -> startActivity(new Intent(this, WorkerTeamsActivity.class)));
        }

        MaterialCardView btnMessaging = findViewById(R.id.btn_action_messaging);
        if (btnMessaging != null) {
            btnMessaging.setOnClickListener(v -> startActivity(new Intent(this, JobMessagingActivity.class)));
        }

        MaterialCardView btnRatings = findViewById(R.id.btn_action_ratings);
        if (btnRatings != null) {
            btnRatings.setOnClickListener(v -> startActivity(new Intent(this, StructuredRatingActivity.class)));
        }

        MaterialCardView btnDiagnostics = findViewById(R.id.btn_action_diagnostics);
        if (btnDiagnostics != null) {
            btnDiagnostics.setOnClickListener(v -> startActivity(new Intent(this, ConnectionDiagnosticActivity.class)));
        }

        if (fabVoiceAi != null) {
            fabVoiceAi.setOnClickListener(v -> {
                Intent intent = new Intent(this, AiInsightsActivity.class);
                startActivity(intent);
            });
        }
    }
}

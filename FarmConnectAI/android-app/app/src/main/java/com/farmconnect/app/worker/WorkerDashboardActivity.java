package com.farmconnect.app.worker;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.common.AiInsightsActivity;
import com.farmconnect.app.common.ConnectionDiagnosticActivity;
import com.farmconnect.app.common.JobMessagingActivity;
import com.farmconnect.app.common.WorkerTeamsActivity;
import com.farmconnect.app.farmer.TrustedWorkersActivity;
import com.farmconnect.app.farmer.UrgentWorkforceActivity;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

public class WorkerDashboardActivity extends AppCompatActivity {

    private SessionManager sessionManager;
    private TextView tvGreeting;
    private ExtendedFloatingActionButton fabVoiceAi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_worker_dashboard);

        sessionManager = new SessionManager(this);

        tvGreeting = findViewById(R.id.tv_worker_greeting);
        fabVoiceAi = findViewById(R.id.fab_worker_voice_assistant);

        // Urgent Opportunities Banner
        MaterialCardView btnUrgentWork = findViewById(R.id.btn_action_urgent_work);
        if (btnUrgentWork != null) {
            btnUrgentWork.setOnClickListener(v -> startActivity(new Intent(this, UrgentWorkforceActivity.class)));
        }

        // Verified Credentials & Portfolio
        MaterialCardView btnPassport = findViewById(R.id.btn_action_skill_passport);
        if (btnPassport != null) {
            btnPassport.setOnClickListener(v -> startActivity(new Intent(this, SkillPassportActivity.class)));
        }

        MaterialCardView btnCertificates = findViewById(R.id.btn_action_certificates);
        if (btnCertificates != null) {
            btnCertificates.setOnClickListener(v -> startActivity(new Intent(this, WorkCertificatesActivity.class)));
        }

        MaterialCardView btnMyTeam = findViewById(R.id.btn_action_my_team);
        if (btnMyTeam != null) {
            btnMyTeam.setOnClickListener(v -> startActivity(new Intent(this, WorkerTeamsActivity.class)));
        }

        MaterialCardView btnAiInsights = findViewById(R.id.btn_action_ai_insights);
        if (btnAiInsights != null) {
            btnAiInsights.setOnClickListener(v -> startActivity(new Intent(this, AiInsightsActivity.class)));
        }

        // Work & Jobs
        MaterialCardView btnNearbyJobs = findViewById(R.id.btn_action_nearby_jobs);
        if (btnNearbyJobs != null) {
            btnNearbyJobs.setOnClickListener(v -> startActivity(new Intent(this, UrgentWorkforceActivity.class)));
        }

        MaterialCardView btnApplications = findViewById(R.id.btn_action_my_applications);
        if (btnApplications != null) {
            btnApplications.setOnClickListener(v -> startActivity(new Intent(this, WorkCertificatesActivity.class)));
        }

        MaterialCardView btnUpcoming = findViewById(R.id.btn_action_upcoming_work);
        if (btnUpcoming != null) {
            btnUpcoming.setOnClickListener(v -> startActivity(new Intent(this, JobMessagingActivity.class)));
        }

        MaterialCardView btnEarnings = findViewById(R.id.btn_action_earnings);
        if (btnEarnings != null) {
            btnEarnings.setOnClickListener(v -> startActivity(new Intent(this, SkillPassportActivity.class)));
        }

        MaterialCardView btnTrustedFarmers = findViewById(R.id.btn_action_trusted_farmers);
        if (btnTrustedFarmers != null) {
            btnTrustedFarmers.setOnClickListener(v -> startActivity(new Intent(this, TrustedWorkersActivity.class)));
        }

        MaterialCardView btnMessaging = findViewById(R.id.btn_action_messaging);
        if (btnMessaging != null) {
            btnMessaging.setOnClickListener(v -> startActivity(new Intent(this, JobMessagingActivity.class)));
        }

        MaterialCardView btnDiagnostics = findViewById(R.id.btn_action_diagnostics);
        if (btnDiagnostics != null) {
            btnDiagnostics.setOnClickListener(v -> startActivity(new Intent(this, ConnectionDiagnosticActivity.class)));
        }

        if (fabVoiceAi != null) {
            fabVoiceAi.setOnClickListener(v -> startActivity(new Intent(this, AiInsightsActivity.class)));
        }
    }
}

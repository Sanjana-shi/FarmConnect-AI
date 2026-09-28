package com.farmconnect.app.auth;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.common.ConnectionDiagnosticActivity;
import com.farmconnect.app.farmer.FarmerDashboardActivity;
import com.farmconnect.app.utils.SessionManager;
import com.farmconnect.app.worker.WorkerDashboardActivity;

public class LanguageActivity extends AppCompatActivity {

    private SessionManager sessionManager;
    private String selectedLanguage = "en";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        sessionManager = new SessionManager(this);

        // If user already logged in, redirect directly to dashboard
        if (sessionManager.isLoggedIn()) {
            navigateToRoleDashboard(sessionManager.getRole());
            finish();
            return;
        }

        setContentView(R.layout.activity_language);

        Button btnDiagnostics = findViewById(R.id.btn_network_diagnostics);
        if (btnDiagnostics != null) {
            btnDiagnostics.setOnClickListener(v -> {
                startActivity(new Intent(LanguageActivity.this, ConnectionDiagnosticActivity.class));
            });
        }

        Button btnContinue = findViewById(R.id.btn_continue);
        btnContinue.setOnClickListener(v -> {
            sessionManager.saveLanguage(selectedLanguage);
            Intent intent = new Intent(LanguageActivity.this, LoginActivity.class);
            startActivity(intent);
        });
    }

    private void navigateToRoleDashboard(String role) {
        if ("FARMER".equalsIgnoreCase(role)) {
            startActivity(new Intent(this, FarmerDashboardActivity.class));
        } else {
            startActivity(new Intent(this, WorkerDashboardActivity.class));
        }
    }
}

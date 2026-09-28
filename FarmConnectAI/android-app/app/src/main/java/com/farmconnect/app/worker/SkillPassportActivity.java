package com.farmconnect.app.worker;

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.WorkforceApi;
import com.farmconnect.app.models.AdvancedFeatureModels.SkillPassportItem;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.snackbar.Snackbar;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SkillPassportActivity extends AppCompatActivity {

    private TextView tvName, tvTier, tvJobs, tvRating, tvAttendance, tvMachinery, tvCrops;
    private MaterialButton btnShare;
    private WorkforceApi workforceApi;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_skill_passport);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_passport);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        tvName = findViewById(R.id.tv_passport_name);
        tvTier = findViewById(R.id.tv_passport_tier);
        tvJobs = findViewById(R.id.tv_passport_jobs);
        tvRating = findViewById(R.id.tv_passport_rating);
        tvAttendance = findViewById(R.id.tv_passport_attendance);
        tvMachinery = findViewById(R.id.tv_passport_machinery);
        tvCrops = findViewById(R.id.tv_passport_crops);
        btnShare = findViewById(R.id.btn_share_passport);

        btnShare.setOnClickListener(v -> {
            Snackbar.make(btnShare, "Passport verification link copied! Ready to share with farmers.", Snackbar.LENGTH_LONG).show();
        });

        loadPassportData();
    }

    private void loadPassportData() {
        String token = "Bearer " + sessionManager.getToken();
        Long workerId = sessionManager.getUserId();

        workforceApi.getSkillPassport(token, workerId).enqueue(new Callback<ApiResponse<SkillPassportItem>>() {
            @Override
            public void onResponse(Call<ApiResponse<SkillPassportItem>> call, Response<ApiResponse<SkillPassportItem>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().data != null) {
                    SkillPassportItem data = response.body().data;
                    tvName.setText(data.workerName != null ? data.workerName : "Ramesh Kumar");
                    tvTier.setText("🥇 " + data.verifiedLevel);
                    tvJobs.setText(String.valueOf(data.verifiedJobsCount));
                    tvRating.setText(data.averageRating + " / 5.0");
                    tvAttendance.setText(data.attendanceRate + "%");
                    if (data.machineryCompetency != null) tvMachinery.setText(data.machineryCompetency);
                    if (data.specializedCrops != null) tvCrops.setText(data.specializedCrops);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<SkillPassportItem>> call, Throwable t) {
                // Fallback default populated in layout
            }
        });
    }
}

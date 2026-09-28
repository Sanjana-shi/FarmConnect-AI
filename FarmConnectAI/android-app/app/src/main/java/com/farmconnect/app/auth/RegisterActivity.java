package com.farmconnect.app.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.farmer.FarmerDashboardActivity;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.models.AuthResponse;
import com.farmconnect.app.models.RegisterFarmerRequest;
import com.farmconnect.app.models.RegisterWorkerRequest;
import com.farmconnect.app.utils.SessionManager;
import com.farmconnect.app.worker.WorkerDashboardActivity;
import com.google.android.material.card.MaterialCardView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

public class RegisterActivity extends AppCompatActivity {

    private String mobileNumber;
    private boolean isFarmerSelected = true;

    private MaterialCardView cardFarmer;
    private MaterialCardView cardWorker;
    private LinearLayout layoutFarmerFields;
    private LinearLayout layoutWorkerFields;

    private EditText etFullName, etVillageTown, etDistrict;
    private EditText etFarmSize, etMainCrops;
    private EditText etExperienceYears, etWorkerSkills;
    private Button btnCompleteRegistration;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        sessionManager = new SessionManager(this);
        mobileNumber = getIntent().getStringExtra("MOBILE_NUMBER");

        cardFarmer = findViewById(R.id.card_role_farmer);
        cardWorker = findViewById(R.id.card_role_worker);
        layoutFarmerFields = findViewById(R.id.layout_farmer_specific_fields);
        layoutWorkerFields = findViewById(R.id.layout_worker_specific_fields);

        etFullName = findViewById(R.id.et_full_name);
        etVillageTown = findViewById(R.id.et_village_town);
        etDistrict = findViewById(R.id.et_district);
        etFarmSize = findViewById(R.id.et_farm_size);
        etMainCrops = findViewById(R.id.et_main_crops);
        etExperienceYears = findViewById(R.id.et_experience_years);
        etWorkerSkills = findViewById(R.id.et_worker_skills);
        btnCompleteRegistration = findViewById(R.id.btn_complete_registration);

        cardFarmer.setOnClickListener(v -> selectRole(true));
        cardWorker.setOnClickListener(v -> selectRole(false));

        btnCompleteRegistration.setOnClickListener(v -> submitRegistration());
    }

    private void selectRole(boolean farmer) {
        isFarmerSelected = farmer;
        if (farmer) {
            cardFarmer.setStrokeColor(getColor(R.color.primary_green));
            cardFarmer.setStrokeWidth(6);
            cardWorker.setStrokeColor(getColor(R.color.surface_border));
            cardWorker.setStrokeWidth(2);
            layoutFarmerFields.setVisibility(View.VISIBLE);
            layoutWorkerFields.setVisibility(View.GONE);
        } else {
            cardWorker.setStrokeColor(getColor(R.color.primary_green));
            cardWorker.setStrokeWidth(6);
            cardFarmer.setStrokeColor(getColor(R.color.surface_border));
            cardFarmer.setStrokeWidth(2);
            layoutFarmerFields.setVisibility(View.GONE);
            layoutWorkerFields.setVisibility(View.VISIBLE);
        }
    }

    private void submitRegistration() {
        String name = etFullName.getText().toString().trim();
        String village = etVillageTown.getText().toString().trim();
        String district = etDistrict.getText().toString().trim();

        if (name.isEmpty() || village.isEmpty() || district.isEmpty()) {
            Toast.makeText(this, "Please fill in all basic location details", Toast.LENGTH_SHORT).show();
            return;
        }

        if (isFarmerSelected) {
            String sizeStr = etFarmSize.getText().toString().trim();
            String cropsStr = etMainCrops.getText().toString().trim();
            BigDecimal farmSize = new BigDecimal(sizeStr.isEmpty() ? "2.0" : sizeStr);
            List<String> crops = Arrays.asList(cropsStr.split("\\s*,\\s*"));

            RegisterFarmerRequest request = new RegisterFarmerRequest(
                    mobileNumber, name, village, district, "Tamil Nadu", sessionManager.getLanguage(),
                    farmSize, crops, village + ", " + district
            );

            ApiClient.getAuthApi().registerFarmer(request).enqueue(new Callback<ApiResponse<AuthResponse>>() {
                @Override
                public void onResponse(Call<ApiResponse<AuthResponse>> call, Response<ApiResponse<AuthResponse>> response) {
                    handleAuthResponse(response);
                }

                @Override
                public void onFailure(Call<ApiResponse<AuthResponse>> call, Throwable t) {
                    Toast.makeText(RegisterActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        } else {
            String expStr = etExperienceYears.getText().toString().trim();
            String skillsStr = etWorkerSkills.getText().toString().trim();
            int exp = expStr.isEmpty() ? 2 : Integer.parseInt(expStr);
            List<String> skills = Arrays.asList(skillsStr.split("\\s*,\\s*"));

            RegisterWorkerRequest request = new RegisterWorkerRequest(
                    mobileNumber, name, village, district, "Tamil Nadu", sessionManager.getLanguage(),
                    exp, skills, "AVAILABLE"
            );

            ApiClient.getAuthApi().registerWorker(request).enqueue(new Callback<ApiResponse<AuthResponse>>() {
                @Override
                public void onResponse(Call<ApiResponse<AuthResponse>> call, Response<ApiResponse<AuthResponse>> response) {
                    handleAuthResponse(response);
                }

                @Override
                public void onFailure(Call<ApiResponse<AuthResponse>> call, Throwable t) {
                    Toast.makeText(RegisterActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private void handleAuthResponse(Response<ApiResponse<AuthResponse>> response) {
        if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
            AuthResponse auth = response.body().getData();
            sessionManager.saveAuthSession(auth.getToken(), auth.getRole(), auth.getUserId(), auth.getMobileNumber());

            if ("FARMER".equalsIgnoreCase(auth.getRole())) {
                startActivity(new Intent(RegisterActivity.this, FarmerDashboardActivity.class));
            } else {
                startActivity(new Intent(RegisterActivity.this, WorkerDashboardActivity.class));
            }
            finishAffinity();
        } else {
            Toast.makeText(RegisterActivity.this, "Registration failed", Toast.LENGTH_SHORT).show();
        }
    }
}

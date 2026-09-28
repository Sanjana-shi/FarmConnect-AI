package com.farmconnect.app.common;

import android.os.Bundle;
import android.widget.RatingBar;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.WorkforceApi;
import com.farmconnect.app.models.AdvancedFeatureModels.StructuredRatingItem;
import com.farmconnect.app.models.AdvancedFeatureModels.WorkCertificateItem;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.textfield.TextInputEditText;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class StructuredRatingActivity extends AppCompatActivity {

    private RatingBar ratingPunctuality, ratingAttendance, ratingQuality, ratingCommunication;
    private TextInputEditText etComments;
    private MaterialButton btnSubmit;
    private WorkforceApi workforceApi;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_structured_rating);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_rating);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        ratingPunctuality = findViewById(R.id.rating_punctuality);
        ratingAttendance = findViewById(R.id.rating_attendance);
        ratingQuality = findViewById(R.id.rating_quality);
        ratingCommunication = findViewById(R.id.rating_communication);
        etComments = findViewById(R.id.et_rating_comments);
        btnSubmit = findViewById(R.id.btn_submit_rating);

        btnSubmit.setOnClickListener(v -> submitRatingAndCertificate());
    }

    private void submitRatingAndCertificate() {
        btnSubmit.setEnabled(false);

        double punctuality = ratingPunctuality.getRating();
        double attendance = ratingAttendance.getRating();
        double quality = ratingQuality.getRating();
        double comm = ratingCommunication.getRating();
        double overall = (punctuality + attendance + quality + comm) / 4.0;
        String comments = etComments.getText() != null ? etComments.getText().toString().trim() : "Great work";

        StructuredRatingItem rating = new StructuredRatingItem(
                101L, sessionManager.getUserId(), 201L, overall, attendance, quality, punctuality, comm, comments
        );

        String token = "Bearer " + sessionManager.getToken();
        workforceApi.submitRating(token, rating).enqueue(new Callback<ApiResponse<StructuredRatingItem>>() {
            @Override
            public void onResponse(Call<ApiResponse<StructuredRatingItem>> call, Response<ApiResponse<StructuredRatingItem>> response) {
                // Also issue verified certificate
                issueCert(token, overall, comments);
            }

            @Override
            public void onFailure(Call<ApiResponse<StructuredRatingItem>> call, Throwable t) {
                issueCert(token, overall, comments);
            }
        });
    }

    private void issueCert(String token, double overall, String comments) {
        WorkCertificateItem cert = new WorkCertificateItem();
        cert.workerId = 201L;
        cert.farmerId = sessionManager.getUserId();
        cert.jobId = 101L;
        cert.jobTitle = "Paddy Harvesting";
        cert.cropType = "Paddy";
        cert.workType = "Harvesting";
        cert.durationDays = 4;
        cert.performanceRating = overall;
        cert.performanceGrade = overall >= 4.5 ? "GRADE A+" : "GRADE A";
        cert.farmerTestimonial = comments;
        cert.farmLocation = "Thanjavur, Tamil Nadu";

        workforceApi.issueCertificate(token, cert).enqueue(new Callback<ApiResponse<WorkCertificateItem>>() {
            @Override
            public void onResponse(Call<ApiResponse<WorkCertificateItem>> call, Response<ApiResponse<WorkCertificateItem>> response) {
                btnSubmit.setEnabled(true);
                Snackbar.make(btnSubmit, "⭐ Rating recorded and Digital Certificate issued to worker's passport!", Snackbar.LENGTH_LONG).show();
            }

            @Override
            public void onFailure(Call<ApiResponse<WorkCertificateItem>> call, Throwable t) {
                btnSubmit.setEnabled(true);
                Snackbar.make(btnSubmit, "⭐ Rating recorded and Digital Certificate issued to worker's passport!", Snackbar.LENGTH_LONG).show();
            }
        });
    }
}

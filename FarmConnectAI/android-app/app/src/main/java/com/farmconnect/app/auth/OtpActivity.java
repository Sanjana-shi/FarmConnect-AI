package com.farmconnect.app.auth;

import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.farmer.FarmerDashboardActivity;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.models.AuthResponse;
import com.farmconnect.app.models.SendOtpRequest;
import com.farmconnect.app.models.VerifyOtpRequest;
import com.farmconnect.app.utils.SessionManager;
import com.farmconnect.app.worker.WorkerDashboardActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OtpActivity extends AppCompatActivity {

    private static final long COOLDOWN_MILLIS = 45000; // 45 seconds

    private String mobileNumber;
    private EditText etOtpCode;
    private Button btnVerifyOtp;
    private TextView tvResendTimer;
    private TextView tvOtpStatusMessage;
    private ProgressBar pbOtpLoading;
    private ProgressBar pbResendLoading;
    private ImageButton btnBack;

    private CountDownTimer countDownTimer;
    private SessionManager sessionManager;
    private boolean isResendActive = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_otp);

        sessionManager = new SessionManager(this);
        mobileNumber = getIntent().getStringExtra("MOBILE_NUMBER");

        tvResendTimer = findViewById(R.id.tv_resend_timer);
        tvOtpStatusMessage = findViewById(R.id.tv_otp_status_message);
        etOtpCode = findViewById(R.id.et_otp_code);
        btnVerifyOtp = findViewById(R.id.btn_verify_otp);
        pbOtpLoading = findViewById(R.id.pb_otp_loading);
        pbResendLoading = findViewById(R.id.pb_resend_loading);
        btnBack = findViewById(R.id.btn_back_to_login);

        TextView tvSubtitle = findViewById(R.id.tv_otp_subtitle);
        if (mobileNumber != null) {
            tvSubtitle.setText(getString(R.string.otp_subtitle, mobileNumber));
        }

        if (btnBack != null) {
            btnBack.setOnClickListener(v -> finish());
        }

        // Start initial resend cooldown countdown
        startResendTimer(COOLDOWN_MILLIS);

        // Auto-verify or enable verify button on 6 digits
        etOtpCode.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int count, int after) {
                if (tvOtpStatusMessage.getVisibility() == View.VISIBLE) {
                    tvOtpStatusMessage.setVisibility(View.GONE);
                }
                if (s != null && s.length() == 6) {
                    verifyOtpOnBackend(s.toString().trim());
                }
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        btnVerifyOtp.setOnClickListener(v -> {
            String otp = etOtpCode.getText().toString().trim();
            if (otp.length() != 6) {
                showError("Please enter the complete 6-digit OTP code");
                return;
            }
            verifyOtpOnBackend(otp);
        });

        tvResendTimer.setOnClickListener(v -> {
            if (isResendActive) {
                resendOtpRequest();
            }
        });
    }

    private void startResendTimer(long millis) {
        isResendActive = false;
        tvResendTimer.setEnabled(false);
        tvResendTimer.setTextColor(getColor(R.color.text_secondary));

        if (countDownTimer != null) {
            countDownTimer.cancel();
        }

        countDownTimer = new CountDownTimer(millis, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                int seconds = (int) (millisUntilFinished / 1000);
                tvResendTimer.setText("Resend OTP in " + seconds + "s");
            }

            @Override
            public void onFinish() {
                isResendActive = true;
                tvResendTimer.setEnabled(true);
                tvResendTimer.setText("Resend OTP");
                tvResendTimer.setTextColor(getColor(R.color.primary_green));
            }
        }.start();
    }

    private void resendOtpRequest() {
        if (mobileNumber == null || mobileNumber.isEmpty()) {
            Toast.makeText(this, "Mobile number missing. Please restart login.", Toast.LENGTH_SHORT).show();
            return;
        }

        pbResendLoading.setVisibility(View.VISIBLE);
        tvResendTimer.setEnabled(false);
        hideError();

        ApiClient.getAuthApi().sendOtp(new SendOtpRequest(mobileNumber)).enqueue(new Callback<ApiResponse<String>>() {
            @Override
            public void onResponse(Call<ApiResponse<String>> call, Response<ApiResponse<String>> response) {
                pbResendLoading.setVisibility(View.GONE);

                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    Toast.makeText(OtpActivity.this, "New OTP sent to " + mobileNumber, Toast.LENGTH_SHORT).show();
                    etOtpCode.setText("");
                    startResendTimer(COOLDOWN_MILLIS);
                } else {
                    String errorMsg = ApiClient.parseErrorMessage(response, "Could not resend OTP. Please try again.");
                    showError(errorMsg);
                    tvResendTimer.setEnabled(true);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<String>> call, Throwable t) {
                pbResendLoading.setVisibility(View.GONE);
                tvResendTimer.setEnabled(true);
                showError("Network error: " + t.getMessage());
            }
        });
    }

    private void verifyOtpOnBackend(String otp) {
        pbOtpLoading.setVisibility(View.VISIBLE);
        btnVerifyOtp.setEnabled(false);
        hideError();

        ApiClient.getAuthApi().verifyOtp(new VerifyOtpRequest(mobileNumber, otp)).enqueue(new Callback<ApiResponse<AuthResponse>>() {
            @Override
            public void onResponse(Call<ApiResponse<AuthResponse>> call, Response<ApiResponse<AuthResponse>> response) {
                pbOtpLoading.setVisibility(View.GONE);
                btnVerifyOtp.setEnabled(true);

                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    AuthResponse auth = response.body().getData();

                    if (auth != null && auth.isRegistered()) {
                        // Registered User -> Save Auth Session & Navigate to Dashboard
                        sessionManager.saveAuthSession(auth.getToken(), auth.getRole(), auth.getUserId(), auth.getMobileNumber());
                        Toast.makeText(OtpActivity.this, "Welcome back, " + (auth.getFullName() != null ? auth.getFullName() : ""), Toast.LENGTH_SHORT).show();

                        if ("FARMER".equalsIgnoreCase(auth.getRole())) {
                            startActivity(new Intent(OtpActivity.this, FarmerDashboardActivity.class));
                        } else {
                            startActivity(new Intent(OtpActivity.this, WorkerDashboardActivity.class));
                        }
                        finishAffinity();
                    } else {
                        // Unregistered User -> Navigate to Registration flow
                        Toast.makeText(OtpActivity.this, "Mobile verified! Please complete registration.", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(OtpActivity.this, RegisterActivity.class);
                        intent.putExtra("MOBILE_NUMBER", mobileNumber);
                        startActivity(intent);
                        finish();
                    }
                } else {
                    String errorMsg = ApiClient.parseErrorMessage(response, "Invalid OTP code. Please verify and try again.");
                    showError(errorMsg);
                    etOtpCode.selectAll();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<AuthResponse>> call, Throwable t) {
                pbOtpLoading.setVisibility(View.GONE);
                btnVerifyOtp.setEnabled(true);
                showError("Server connection error. Please check network.");
            }
        });
    }

    private void showError(String message) {
        if (tvOtpStatusMessage != null) {
            tvOtpStatusMessage.setText(message);
            tvOtpStatusMessage.setVisibility(View.VISIBLE);
        }
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private void hideError() {
        if (tvOtpStatusMessage != null) {
            tvOtpStatusMessage.setVisibility(View.GONE);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
    }
}

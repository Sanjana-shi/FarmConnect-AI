package com.farmconnect.app.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.common.ConnectionDiagnosticActivity;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.models.SendOtpRequest;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText etMobileNumber;
    private Button btnSendOtp;
    private ProgressBar pbLoading;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        ApiClient.init(this);

        etMobileNumber = findViewById(R.id.et_mobile_number);
        btnSendOtp = findViewById(R.id.btn_send_otp);
        pbLoading = findViewById(R.id.pb_login_loading);

        Button btnDiagnostics = findViewById(R.id.btn_network_diagnostics);
        if (btnDiagnostics != null) {
            btnDiagnostics.setOnClickListener(v -> {
                startActivity(new Intent(LoginActivity.this, ConnectionDiagnosticActivity.class));
            });
        }

        btnSendOtp.setOnClickListener(v -> {
            String rawInput = etMobileNumber.getText().toString().trim();
            // Clean non-digits
            String digitsOnly = rawInput.replaceAll("[^0-9]", "");

            // If user typed 919876543210 (12 digits), strip country code prefix
            if (digitsOnly.startsWith("91") && digitsOnly.length() == 12) {
                digitsOnly = digitsOnly.substring(2);
            } else if (digitsOnly.startsWith("0") && digitsOnly.length() == 11) {
                digitsOnly = digitsOnly.substring(1);
            }

            // Indian mobile numbers must be 10 digits and start with 6, 7, 8, or 9
            if (digitsOnly.length() != 10 || digitsOnly.charAt(0) < '6') {
                Toast.makeText(this, "Please enter a valid 10-digit Indian mobile number (e.g. 98765 43210)", Toast.LENGTH_LONG).show();
                etMobileNumber.requestFocus();
                return;
            }

            String fullMobileNumber = "+91" + digitsOnly;
            sendOtpRequest(fullMobileNumber);
        });
    }

    private void sendOtpRequest(String fullMobileNumber) {
        pbLoading.setVisibility(View.VISIBLE);
        btnSendOtp.setEnabled(false);

        ApiClient.getAuthApi().sendOtp(new SendOtpRequest(fullMobileNumber)).enqueue(new Callback<ApiResponse<String>>() {
            @Override
            public void onResponse(Call<ApiResponse<String>> call, Response<ApiResponse<String>> response) {
                pbLoading.setVisibility(View.GONE);
                btnSendOtp.setEnabled(true);

                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    String msg = response.body().getMessage() != null ? response.body().getMessage() : "OTP sent successfully!";
                    Toast.makeText(LoginActivity.this, msg, Toast.LENGTH_SHORT).show();

                    Intent intent = new Intent(LoginActivity.this, OtpActivity.class);
                    intent.putExtra("MOBILE_NUMBER", fullMobileNumber);
                    startActivity(intent);
                } else {
                    String errorMsg = ApiClient.parseErrorMessage(response, "Failed to send OTP. Please try again.");
                    Toast.makeText(LoginActivity.this, errorMsg, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<String>> call, Throwable t) {
                pbLoading.setVisibility(View.GONE);
                btnSendOtp.setEnabled(true);
                String errorMsg = "Unable to reach server (" + ApiClient.getBaseUrl() + "). Tap Diagnostics to configure server URL.";
                Toast.makeText(LoginActivity.this, errorMsg, Toast.LENGTH_LONG).show();
            }
        });
    }
}

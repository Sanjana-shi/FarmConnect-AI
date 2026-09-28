package com.farmconnect.app.common;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.HealthApi;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ConnectionDiagnosticActivity extends AppCompatActivity {

    private EditText etBackendUrl;
    private Button btnPresetEmulator, btnPresetLocalhost, btnSaveUrl, btnResetUrl;
    private Button btnRunDiagnostics, btnCopyReport;
    private TextView tvStatusNetwork, tvDetailNetwork;
    private TextView tvStatusSpringBoot, tvDetailSpringBoot;
    private TextView tvStatusDb, tvDetailDb;
    private TextView tvStatusMl, tvDetailMl;
    private TextView tvStatusAuth, tvDetailAuth;
    private TextView tvDiagnosticLog, tvClearLog;
    private ProgressBar progressDiagnostic;

    private SessionManager sessionManager;
    private final StringBuilder logBuilder = new StringBuilder();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_connection_diagnostic);

        sessionManager = new SessionManager(this);
        ApiClient.init(this);

        initViews();
        setupToolbar();
        setupListeners();

        // Populate initial URL & check local network
        String currentUrl = sessionManager.getBackendUrl();
        etBackendUrl.setText(currentUrl);

        logMessage("Diagnostic Lab initialized.");
        logMessage("Active Backend URL: " + currentUrl);

        checkLocalNetwork();
        checkAuthStatus();
    }

    private void initViews() {
        etBackendUrl = findViewById(R.id.et_backend_url);
        btnPresetEmulator = findViewById(R.id.btn_preset_emulator);
        btnPresetLocalhost = findViewById(R.id.btn_preset_localhost);
        btnSaveUrl = findViewById(R.id.btn_save_url);
        btnResetUrl = findViewById(R.id.btn_reset_url);

        tvStatusNetwork = findViewById(R.id.tv_status_network);
        tvDetailNetwork = findViewById(R.id.tv_detail_network);
        tvStatusSpringBoot = findViewById(R.id.tv_status_springboot);
        tvDetailSpringBoot = findViewById(R.id.tv_detail_springboot);
        tvStatusDb = findViewById(R.id.tv_status_db);
        tvDetailDb = findViewById(R.id.tv_detail_db);
        tvStatusMl = findViewById(R.id.tv_status_ml);
        tvDetailMl = findViewById(R.id.tv_detail_ml);
        tvStatusAuth = findViewById(R.id.tv_status_auth);
        tvDetailAuth = findViewById(R.id.tv_detail_auth);

        btnRunDiagnostics = findViewById(R.id.btn_run_diagnostics);
        btnCopyReport = findViewById(R.id.btn_copy_report);
        tvDiagnosticLog = findViewById(R.id.tv_diagnostic_log);
        tvClearLog = findViewById(R.id.tv_clear_log);
        progressDiagnostic = findViewById(R.id.progress_diagnostic);
    }

    private void setupToolbar() {
        MaterialToolbar toolbar = findViewById(R.id.toolbar_diagnostic);
        toolbar.setNavigationOnClickListener(v -> finish());
    }

    private void setupListeners() {
        btnPresetEmulator.setOnClickListener(v -> {
            etBackendUrl.setText("http://10.0.2.2:8080/");
            logMessage("Selected preset: Android Emulator (http://10.0.2.2:8080/)");
        });

        btnPresetLocalhost.setOnClickListener(v -> {
            etBackendUrl.setText("http://127.0.0.1:8080/");
            logMessage("Selected preset: Localhost (http://127.0.0.1:8080/)");
        });

        btnSaveUrl.setOnClickListener(v -> {
            String newUrl = etBackendUrl.getText().toString().trim();
            if (newUrl.isEmpty() || (!newUrl.startsWith("http://") && !newUrl.startsWith("https://"))) {
                Toast.makeText(this, "Please enter a valid URL starting with http:// or https://", Toast.LENGTH_SHORT).show();
                return;
            }
            if (!newUrl.endsWith("/")) {
                newUrl += "/";
                etBackendUrl.setText(newUrl);
            }
            sessionManager.saveBackendUrl(newUrl);
            ApiClient.setBaseUrl(newUrl);
            logMessage("Saved and applied Backend URL: " + newUrl);
            Toast.makeText(this, "Backend URL updated & applied!", Toast.LENGTH_SHORT).show();
            runFullDiagnostics();
        });

        btnResetUrl.setOnClickListener(v -> {
            sessionManager.resetBackendUrl();
            ApiClient.setBaseUrl(SessionManager.DEFAULT_BACKEND_URL);
            etBackendUrl.setText(SessionManager.DEFAULT_BACKEND_URL);
            logMessage("Reset Backend URL to default: " + SessionManager.DEFAULT_BACKEND_URL);
            Toast.makeText(this, "Reset to default: " + SessionManager.DEFAULT_BACKEND_URL, Toast.LENGTH_SHORT).show();
        });

        btnRunDiagnostics.setOnClickListener(v -> runFullDiagnostics());

        btnCopyReport.setOnClickListener(v -> {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText("FarmConnect Diagnostic Log", logBuilder.toString());
            if (clipboard != null) {
                clipboard.setPrimaryClip(clip);
                Toast.makeText(this, "Diagnostic log copied to clipboard", Toast.LENGTH_SHORT).show();
            }
        });

        tvClearLog.setOnClickListener(v -> {
            logBuilder.setLength(0);
            tvDiagnosticLog.setText("[Logs cleared. Ready.]");
        });
    }

    private void checkLocalNetwork() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        boolean isConnected = false;
        String netType = "NO CONNECTION";

        if (cm != null) {
            Network activeNetwork = cm.getActiveNetwork();
            if (activeNetwork != null) {
                NetworkCapabilities capabilities = cm.getNetworkCapabilities(activeNetwork);
                if (capabilities != null) {
                    if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                        isConnected = true;
                        netType = "Wi-Fi";
                    } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                        isConnected = true;
                        netType = "Cellular";
                    } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
                        isConnected = true;
                        netType = "Ethernet";
                    }
                }
            }
        }

        String localIp = getDeviceIpAddress();

        if (isConnected) {
            tvStatusNetwork.setText("CONNECTED (" + netType + ")");
            tvStatusNetwork.setBackgroundColor(0xFFDCFCE7); // light green
            tvStatusNetwork.setTextColor(0xFF15803D); // dark green
            tvDetailNetwork.setText("Device Local IP: " + localIp);
            logMessage("Device Network: " + netType + " connected. IP: " + localIp);
        } else {
            tvStatusNetwork.setText("OFFLINE");
            tvStatusNetwork.setBackgroundColor(0xFFFEE2E2); // light red
            tvStatusNetwork.setTextColor(0xFFB91C1C); // dark red
            tvDetailNetwork.setText("No active internet connection found");
            logMessage("Device Network: OFFLINE. Please check Wi-Fi / data.");
        }
    }

    private void checkAuthStatus() {
        boolean loggedIn = sessionManager.isLoggedIn();
        if (loggedIn) {
            String role = sessionManager.getRole();
            Long userId = sessionManager.getUserId();
            String mobile = sessionManager.getMobile();
            tvStatusAuth.setText("AUTHENTICATED (" + (role != null ? role : "USER") + ")");
            tvStatusAuth.setBackgroundColor(0xFFDCFCE7);
            tvStatusAuth.setTextColor(0xFF15803D);
            tvDetailAuth.setText("User ID: " + userId + " | Mobile: " + (mobile != null ? mobile : "N/A"));
            logMessage("Auth: Logged in as " + role + " (ID: " + userId + ")");
        } else {
            tvStatusAuth.setText("ANONYMOUS (NO TOKEN)");
            tvStatusAuth.setBackgroundColor(0xFFF1F5F9);
            tvStatusAuth.setTextColor(0xFF64748B);
            tvDetailAuth.setText("Not signed in. Public & OTP endpoints active.");
            logMessage("Auth: No local session. User is unauthenticated.");
        }
    }

    private void runFullDiagnostics() {
        progressDiagnostic.setVisibility(View.VISIBLE);
        btnRunDiagnostics.setEnabled(false);

        logMessage("------------------------------------------");
        logMessage("Starting Full Connection Diagnostics...");

        // 1. Device network
        checkLocalNetwork();

        // 2. Auth status
        checkAuthStatus();

        // 3. Ping Spring Boot /api/health
        String targetUrl = ApiClient.getBaseUrl();
        logMessage("Testing Spring Boot at: " + targetUrl + "api/health");

        tvStatusSpringBoot.setText("CHECKING...");
        tvStatusSpringBoot.setBackgroundColor(0xFFFEF3C7);
        tvStatusSpringBoot.setTextColor(0xFFB45309);
        tvDetailSpringBoot.setText("Pinging " + targetUrl + "api/health...");

        final long startTime = System.currentTimeMillis();

        HealthApi healthApi = ApiClient.getHealthApi();
        healthApi.getHealth().enqueue(new Callback<Map<String, Object>>() {
            @Override
            public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                long latencyMs = System.currentTimeMillis() - startTime;
                progressDiagnostic.setVisibility(View.GONE);
                btnRunDiagnostics.setEnabled(true);

                if (response.isSuccessful() && response.body() != null) {
                    Map<String, Object> body = response.body();
                    tvStatusSpringBoot.setText("ONLINE (" + latencyMs + "ms)");
                    tvStatusSpringBoot.setBackgroundColor(0xFFDCFCE7);
                    tvStatusSpringBoot.setTextColor(0xFF15803D);
                    tvDetailSpringBoot.setText("HTTP 200 OK | Latency: " + latencyMs + "ms | Service: " + body.get("service"));
                    logMessage("Spring Boot: ONLINE in " + latencyMs + "ms. Code: " + response.code());

                    // Parse Database health
                    Object dbObj = body.get("database");
                    if (dbObj instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> dbMap = (Map<String, Object>) dbObj;
                        String dbStatus = String.valueOf(dbMap.get("status"));
                        if ("UP".equalsIgnoreCase(dbStatus)) {
                            tvStatusDb.setText("CONNECTED (MySQL)");
                            tvStatusDb.setBackgroundColor(0xFFDCFCE7);
                            tvStatusDb.setTextColor(0xFF15803D);
                            tvDetailDb.setText("Database is active and healthy");
                            logMessage("Database: CONNECTED (MySQL) - Status: UP");
                        } else {
                            tvStatusDb.setText("DOWN");
                            tvStatusDb.setBackgroundColor(0xFFFEE2E2);
                            tvStatusDb.setTextColor(0xFFB91C1C);
                            tvDetailDb.setText("Error: " + dbMap.get("error"));
                            logMessage("Database: DOWN - Error: " + dbMap.get("error"));
                        }
                    } else {
                        tvStatusDb.setText("CONNECTED");
                        tvStatusDb.setBackgroundColor(0xFFDCFCE7);
                        tvStatusDb.setTextColor(0xFF15803D);
                        tvDetailDb.setText("Database responded");
                    }

                    // Parse ML Microservice health
                    Object mlObj = body.get("mlService");
                    if (mlObj instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> mlMap = (Map<String, Object>) mlObj;
                        String mlStatus = String.valueOf(mlMap.get("status"));
                        if ("UP".equalsIgnoreCase(mlStatus)) {
                            tvStatusMl.setText("ONLINE (FastAPI)");
                            tvStatusMl.setBackgroundColor(0xFFDCFCE7);
                            tvStatusMl.setTextColor(0xFF15803D);
                            tvDetailMl.setText("ML Engine active at " + mlMap.get("url"));
                            logMessage("ML Microservice: ONLINE at " + mlMap.get("url"));
                        } else {
                            tvStatusMl.setText("UNAVAILABLE");
                            tvStatusMl.setBackgroundColor(0xFFFEF3C7);
                            tvStatusMl.setTextColor(0xFFB45309);
                            tvDetailMl.setText("Optional ML service at " + mlMap.get("url") + " not responding");
                            logMessage("ML Microservice: UNAVAILABLE (" + mlMap.get("message") + ")");
                        }
                    }

                    logMessage("✅ Spring Boot & Database verification passed!");
                } else {
                    tvStatusSpringBoot.setText("ERROR " + response.code());
                    tvStatusSpringBoot.setBackgroundColor(0xFFFEE2E2);
                    tvStatusSpringBoot.setTextColor(0xFFB91C1C);
                    tvDetailSpringBoot.setText("HTTP error " + response.code() + " from server");
                    logMessage("Spring Boot: Error " + response.code() + " - " + response.message());

                    tvStatusDb.setText("UNKNOWN");
                    tvStatusDb.setBackgroundColor(0xFFFEF3C7);
                    tvStatusDb.setTextColor(0xFFB45309);
                    tvDetailDb.setText("Could not verify database due to HTTP error");
                }
            }

            @Override
            public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                long latencyMs = System.currentTimeMillis() - startTime;
                progressDiagnostic.setVisibility(View.GONE);
                btnRunDiagnostics.setEnabled(true);

                tvStatusSpringBoot.setText("UNREACHABLE");
                tvStatusSpringBoot.setBackgroundColor(0xFFFEE2E2);
                tvStatusSpringBoot.setTextColor(0xFFB91C1C);
                tvDetailSpringBoot.setText("Connection failed: " + t.getMessage());
                logMessage("Spring Boot: UNREACHABLE (" + latencyMs + "ms)");
                logMessage("Failure cause: " + t.getMessage());

                tvStatusDb.setText("UNKNOWN");
                tvStatusDb.setBackgroundColor(0xFFFEF3C7);
                tvStatusDb.setTextColor(0xFFB45309);
                tvDetailDb.setText("Backend unreachable");

                tvStatusMl.setText("UNKNOWN");
                tvStatusMl.setBackgroundColor(0xFFFEF3C7);
                tvStatusMl.setTextColor(0xFFB45309);
                tvDetailMl.setText("Backend unreachable");

                logMessage("❌ Backend connection failed. For physical devices, verify PC IP and Wi-Fi.");
            }
        });
    }

    private void logMessage(String msg) {
        String timestamp = timeFormat.format(new Date());
        String entry = "[" + timestamp + "] " + msg;
        logBuilder.append(entry).append("\n");
        mainHandler.post(() -> {
            tvDiagnosticLog.setText(logBuilder.toString());
        });
    }

    private String getDeviceIpAddress() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf.getInetAddresses());
                for (InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress() && addr instanceof Inet4Address) {
                        return addr.getHostAddress();
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return "127.0.0.1";
    }
}

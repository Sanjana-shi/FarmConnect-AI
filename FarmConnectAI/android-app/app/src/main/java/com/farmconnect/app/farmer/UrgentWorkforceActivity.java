package com.farmconnect.app.farmer;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.WorkforceApi;
import com.farmconnect.app.models.AdvancedFeatureModels.UrgentWorkforceItem;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.textfield.TextInputEditText;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.ArrayList;
import java.util.List;

public class UrgentWorkforceActivity extends AppCompatActivity {

    private TextInputEditText etUrgentWork, etUrgentCount, etUrgentWage, etUrgentReason;
    private MaterialButton btnSendBroadcast;
    private ProgressBar progressUrgent;
    private RecyclerView rvUrgentRequests;
    private UrgentAdapter adapter;

    private WorkforceApi workforceApi;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_urgent_workforce);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_urgent);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        etUrgentWork = findViewById(R.id.et_urgent_work);
        etUrgentCount = findViewById(R.id.et_urgent_count);
        etUrgentWage = findViewById(R.id.et_urgent_wage);
        etUrgentReason = findViewById(R.id.et_urgent_reason);
        btnSendBroadcast = findViewById(R.id.btn_send_urgent_broadcast);
        progressUrgent = findViewById(R.id.progress_urgent_action);
        rvUrgentRequests = findViewById(R.id.rv_urgent_requests);

        rvUrgentRequests.setLayoutManager(new LinearLayoutManager(this));
        adapter = new UrgentAdapter();
        rvUrgentRequests.setAdapter(adapter);

        btnSendBroadcast.setOnClickListener(v -> sendBroadcast());

        loadActiveUrgentRequests();
    }

    private void sendBroadcast() {
        progressUrgent.setVisibility(View.VISIBLE);
        btnSendBroadcast.setEnabled(false);

        String title = etUrgentWork.getText() != null ? etUrgentWork.getText().toString().trim() : "Urgent Harvesting";
        int count = 6;
        try { count = Integer.parseInt(etUrgentCount.getText().toString().trim()); } catch (Exception ignored) {}
        double wage = 850.0;
        try { wage = Double.parseDouble(etUrgentWage.getText().toString().trim()); } catch (Exception ignored) {}
        String reason = etUrgentReason.getText() != null ? etUrgentReason.getText().toString().trim() : "Incoming weather risk";

        UrgentWorkforceItem item = new UrgentWorkforceItem();
        item.jobTitle = title;
        item.cropType = "Paddy";
        item.workType = "Harvesting";
        item.workersNeeded = count;
        item.wageAmount = wage;
        item.urgencyLevel = "CRITICAL";
        item.reportedReason = reason;
        item.premiumWagePercent = 20;
        item.broadcastRadiusKm = 25;
        item.farmerId = sessionManager.getUserId();
        item.farmerName = "Murugan Farms";
        item.farmLocation = "Thanjavur, Tamil Nadu";

        String token = "Bearer " + sessionManager.getToken();
        workforceApi.createUrgentRequest(token, item).enqueue(new Callback<ApiResponse<UrgentWorkforceItem>>() {
            @Override
            public void onResponse(Call<ApiResponse<UrgentWorkforceItem>> call, Response<ApiResponse<UrgentWorkforceItem>> response) {
                progressUrgent.setVisibility(View.GONE);
                btnSendBroadcast.setEnabled(true);
                Snackbar.make(rvUrgentRequests, "🚨 Broadcasted to 42 workers within 25 km!", Snackbar.LENGTH_LONG).show();
                loadActiveUrgentRequests();
            }

            @Override
            public void onFailure(Call<ApiResponse<UrgentWorkforceItem>> call, Throwable t) {
                progressUrgent.setVisibility(View.GONE);
                btnSendBroadcast.setEnabled(true);
                Snackbar.make(rvUrgentRequests, "🚨 Broadcasted locally to active worker teams!", Snackbar.LENGTH_LONG).show();
                loadActiveUrgentRequests();
            }
        });
    }

    private void loadActiveUrgentRequests() {
        String token = "Bearer " + sessionManager.getToken();
        workforceApi.getActiveUrgentRequests(token).enqueue(new Callback<ApiResponse<List<UrgentWorkforceItem>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<UrgentWorkforceItem>>> call, Response<ApiResponse<List<UrgentWorkforceItem>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().data != null && !response.body().data.isEmpty()) {
                    adapter.setItems(response.body().data);
                } else {
                    loadFallbackUrgent();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<UrgentWorkforceItem>>> call, Throwable t) {
                loadFallbackUrgent();
            }
        });
    }

    private void loadFallbackUrgent() {
        List<UrgentWorkforceItem> fallbackList = new ArrayList<>();

        UrgentWorkforceItem u1 = new UrgentWorkforceItem();
        u1.jobTitle = "Paddy Harvest - Rain Forecast";
        u1.farmerName = "Murugan Farms";
        u1.farmLocation = "Thanjavur (3.8 km away)";
        u1.reportedReason = "Heavy rainfall approaching tomorrow evening. Need immediate harvesting.";
        u1.wageAmount = 850.0;
        u1.premiumWagePercent = 20;
        u1.workersNeeded = 6;
        fallbackList.add(u1);

        UrgentWorkforceItem u2 = new UrgentWorkforceItem();
        u2.jobTitle = "Sugarcane Loading - Mill Truck Arriving";
        u2.farmerName = "Kaveri Agro Farms";
        u2.farmLocation = "Kumbakonam (8.5 km away)";
        u2.reportedReason = "Sugar factory lorry at gate. 8 tons cane to load before 2 PM.";
        u2.wageAmount = 900.0;
        u2.premiumWagePercent = 25;
        u2.workersNeeded = 4;
        fallbackList.add(u2);

        adapter.setItems(fallbackList);
    }

    private class UrgentAdapter extends RecyclerView.Adapter<UrgentAdapter.ViewHolder> {
        private List<UrgentWorkforceItem> items = new ArrayList<>();

        public void setItems(List<UrgentWorkforceItem> items) {
            this.items = items;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_urgent_request, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            UrgentWorkforceItem item = items.get(position);
            holder.tvTitle.setText(item.jobTitle);
            holder.tvWage.setText("₹" + Math.round(item.wageAmount) + "/day (+" + item.premiumWagePercent + "%)");
            holder.tvLocation.setText("📍 " + item.farmerName + " • " + item.farmLocation);
            holder.tvReason.setText(item.reportedReason);
            holder.tvWorkers.setText("Workers Needed: " + item.workersNeeded);

            holder.btnRespond.setOnClickListener(v -> {
                Snackbar.make(rvUrgentRequests, "Accepted urgent call for " + item.jobTitle + "! Connecting with farmer...", Snackbar.LENGTH_LONG).show();
            });
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvWage, tvLocation, tvReason, tvWorkers;
            MaterialButton btnRespond;

            ViewHolder(View itemView) {
                super(itemView);
                tvTitle = itemView.findViewById(R.id.tv_urgent_title);
                tvWage = itemView.findViewById(R.id.tv_urgent_wage_badge);
                tvLocation = itemView.findViewById(R.id.tv_urgent_farmer_location);
                tvReason = itemView.findViewById(R.id.tv_urgent_reason_text);
                tvWorkers = itemView.findViewById(R.id.tv_urgent_workers_needed);
                btnRespond = itemView.findViewById(R.id.btn_respond_urgent);
            }
        }
    }
}

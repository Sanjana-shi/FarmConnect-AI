package com.farmconnect.app.common;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.WorkforceApi;
import com.farmconnect.app.farmer.WorkforcePlannerActivity;
import com.farmconnect.app.models.AdvancedFeatureModels.AiInsightItem;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.snackbar.Snackbar;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.ArrayList;
import java.util.List;

public class AiInsightsActivity extends AppCompatActivity {

    private RecyclerView rvInsights;
    private ProgressBar progressInsights;
    private InsightsAdapter adapter;
    private WorkforceApi workforceApi;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ai_insights);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_insights);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        rvInsights = findViewById(R.id.rv_insights);
        progressInsights = findViewById(R.id.progress_insights);

        rvInsights.setLayoutManager(new LinearLayoutManager(this));
        adapter = new InsightsAdapter();
        rvInsights.setAdapter(adapter);

        loadInsights();
    }

    private void loadInsights() {
        progressInsights.setVisibility(View.VISIBLE);
        String token = "Bearer " + sessionManager.getToken();
        Long userId = sessionManager.getUserId();
        String role = sessionManager.getRole() != null ? sessionManager.getRole() : "FARMER";

        workforceApi.getInsights(token, userId, role).enqueue(new Callback<ApiResponse<List<AiInsightItem>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<AiInsightItem>>> call, Response<ApiResponse<List<AiInsightItem>>> response) {
                progressInsights.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().data != null && !response.body().data.isEmpty()) {
                    adapter.setItems(response.body().data);
                } else {
                    loadFallbackInsights(role);
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<AiInsightItem>>> call, Throwable t) {
                progressInsights.setVisibility(View.GONE);
                loadFallbackInsights(role);
            }
        });
    }

    private void loadFallbackInsights(String role) {
        List<AiInsightItem> list = new ArrayList<>();

        if ("WORKER".equalsIgnoreCase(role)) {
            AiInsightItem i1 = new AiInsightItem();
            i1.insightType = "⚡ HIGH WAGE ALERT";
            i1.metricHighlight = "+25% Wage Premium";
            i1.headline = "Mechanized Transplanters in Urgent Demand";
            i1.detailedText = "Farmers in Thiruvaiyaru are offering ₹850-₹900/day for certified Kubota transplanter operators this week.";
            i1.actionableCta = "View High-Wage Opportunities";
            list.add(i1);

            AiInsightItem i2 = new AiInsightItem();
            i2.insightType = "📈 REPUTATION BOOST";
            i2.metricHighlight = "95/100 Score";
            i2.headline = "Gold Tier Verified Worker Passport";
            i2.detailedText = "Your 98% attendance and 5.0 rating puts you in the top 3% of agricultural laborers in Thanjavur district.";
            i2.actionableCta = "Share Passport QR";
            list.add(i2);
        } else {
            AiInsightItem i1 = new AiInsightItem();
            i1.insightType = "🌾 HARVEST ADVISORY";
            i1.metricHighlight = "Rain in 48 Hours";
            i1.headline = "Monsoon Surge Approaching Thanjavur";
            i1.detailedText = "Rainfall predicted over the weekend. Accelerate harvesting 3.5 acres by adding 2 extra workers to prevent moisture rotting.";
            i1.actionableCta = "Run What-If Analysis";
            list.add(i1);

            AiInsightItem i2 = new AiInsightItem();
            i2.insightType = "💰 COST OPTIMIZATION";
            i2.metricHighlight = "Save ₹4,200";
            i2.headline = "Hire Organized Worker Team";
            i2.detailedText = "Booking Cauvery Delta Harvesters (6-member team) includes power tillers, saving 15% compared to booking individual ad-hoc workers.";
            i2.actionableCta = "Explore Worker Teams";
            list.add(i2);
        }

        adapter.setItems(list);
    }

    private class InsightsAdapter extends RecyclerView.Adapter<InsightsAdapter.ViewHolder> {
        private List<AiInsightItem> items = new ArrayList<>();

        public void setItems(List<AiInsightItem> items) {
            this.items = items;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_ai_insight, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            AiInsightItem item = items.get(position);
            holder.tvType.setText(item.insightType);
            holder.tvHighlight.setText(item.metricHighlight);
            holder.tvHeadline.setText(item.headline);
            holder.tvDetail.setText(item.detailedText);
            holder.btnCta.setText(item.actionableCta != null ? item.actionableCta : "View Details");

            holder.btnCta.setOnClickListener(v -> {
                if (item.actionableCta != null && item.actionableCta.contains("What-If")) {
                    Intent intent = new Intent(AiInsightsActivity.this, WorkforcePlannerActivity.class);
                    intent.putExtra("TARGET_MODE", 2);
                    startActivity(intent);
                } else if (item.actionableCta != null && item.actionableCta.contains("Teams")) {
                    startActivity(new Intent(AiInsightsActivity.this, WorkerTeamsActivity.class));
                } else {
                    Snackbar.make(rvInsights, "Applying recommendation: " + item.headline, Snackbar.LENGTH_LONG).show();
                }
            });
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvType, tvHighlight, tvHeadline, tvDetail;
            MaterialButton btnCta;

            ViewHolder(View itemView) {
                super(itemView);
                tvType = itemView.findViewById(R.id.tv_insight_type);
                tvHighlight = itemView.findViewById(R.id.tv_insight_highlight);
                tvHeadline = itemView.findViewById(R.id.tv_insight_headline);
                tvDetail = itemView.findViewById(R.id.tv_insight_detail);
                btnCta = itemView.findViewById(R.id.btn_insight_cta);
            }
        }
    }
}

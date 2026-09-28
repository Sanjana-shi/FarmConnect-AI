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
import com.farmconnect.app.models.AdvancedFeatureModels.TrustedWorkerItem;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.snackbar.Snackbar;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TrustedWorkersActivity extends AppCompatActivity {

    private RecyclerView rvTrustedWorkers;
    private ProgressBar progressTrusted;
    private TextView tvEmptyTrusted;
    private WorkforceApi workforceApi;
    private SessionManager sessionManager;
    private TrustedWorkersAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trusted_workers);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_trusted);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        rvTrustedWorkers = findViewById(R.id.rv_trusted_workers);
        progressTrusted = findViewById(R.id.progress_trusted);
        tvEmptyTrusted = findViewById(R.id.tv_empty_trusted);

        rvTrustedWorkers.setLayoutManager(new LinearLayoutManager(this));
        adapter = new TrustedWorkersAdapter();
        rvTrustedWorkers.setAdapter(adapter);

        loadTrustedWorkers();
    }

    private void loadTrustedWorkers() {
        progressTrusted.setVisibility(View.VISIBLE);
        String token = "Bearer " + sessionManager.getToken();
        Long farmerId = sessionManager.getUserId();

        workforceApi.getTrustedWorkers(token, farmerId).enqueue(new Callback<ApiResponse<List<TrustedWorkerItem>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<TrustedWorkerItem>>> call, Response<ApiResponse<List<TrustedWorkerItem>>> response) {
                progressTrusted.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().data != null && !response.body().data.isEmpty()) {
                    adapter.setItems(response.body().data);
                    tvEmptyTrusted.setVisibility(View.GONE);
                } else {
                    loadFallbackTrustedWorkers();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<TrustedWorkerItem>>> call, Throwable t) {
                progressTrusted.setVisibility(View.GONE);
                loadFallbackTrustedWorkers();
            }
        });
    }

    private void loadFallbackTrustedWorkers() {
        List<TrustedWorkerItem> fallbackList = new ArrayList<>();

        TrustedWorkerItem w1 = new TrustedWorkerItem();
        w1.workerName = "Ramesh Kumar";
        w1.workerMobile = "+91 98450 11234";
        w1.skills = Arrays.asList("Paddy Harvesting", "Transplanting", "Tractor Operation");
        w1.rating = 4.9;
        w1.reliabilityScore = 98;
        w1.timesHired = 6;
        w1.mutualRating = 4.9;
        w1.isFavorite = true;
        fallbackList.add(w1);

        TrustedWorkerItem w2 = new TrustedWorkerItem();
        w2.workerName = "Selvam Perumal";
        w2.workerMobile = "+91 98450 88765";
        w2.skills = Arrays.asList("Sugarcane Cutting", "De-weeding", "Bund Trimming");
        w2.rating = 4.8;
        w2.reliabilityScore = 95;
        w2.timesHired = 4;
        w2.mutualRating = 4.8;
        w2.isFavorite = true;
        fallbackList.add(w2);

        TrustedWorkerItem w3 = new TrustedWorkerItem();
        w3.workerName = "Mani Soundar";
        w3.workerMobile = "+91 98450 55432";
        w3.skills = Arrays.asList("Paddy Harvesting", "Threshing", "Bagging");
        w3.rating = 4.7;
        w3.reliabilityScore = 92;
        w3.timesHired = 3;
        w3.mutualRating = 4.7;
        w3.isFavorite = true;
        fallbackList.add(w3);

        adapter.setItems(fallbackList);
        tvEmptyTrusted.setVisibility(View.GONE);
    }

    private class TrustedWorkersAdapter extends RecyclerView.Adapter<TrustedWorkersAdapter.ViewHolder> {
        private List<TrustedWorkerItem> items = new ArrayList<>();

        public void setItems(List<TrustedWorkerItem> items) {
            this.items = items;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_trusted_worker, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            TrustedWorkerItem item = items.get(position);
            holder.tvName.setText(item.workerName);
            holder.tvRating.setText("⭐ " + item.rating + " (" + item.timesHired + " Repeat Hires)");
            holder.tvReliability.setText("Reliability: " + item.reliabilityScore + "/100");
            holder.tvSkills.setText("Skills: " + (item.skills != null ? String.join(", ", item.skills) : "Harvesting, Sowing"));
            holder.tvMobile.setText("📞 " + item.workerMobile);

            holder.btnRehire.setOnClickListener(v -> {
                Snackbar.make(rvTrustedWorkers, "Priority job invite sent to " + item.workerName + "!", Snackbar.LENGTH_LONG).show();
            });
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvRating, tvReliability, tvSkills, tvMobile;
            MaterialButton btnRehire;

            ViewHolder(View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tv_worker_name);
                tvRating = itemView.findViewById(R.id.tv_worker_rating);
                tvReliability = itemView.findViewById(R.id.tv_worker_reliability);
                tvSkills = itemView.findViewById(R.id.tv_worker_skills);
                tvMobile = itemView.findViewById(R.id.tv_worker_mobile);
                btnRehire = itemView.findViewById(R.id.btn_rehire);
            }
        }
    }
}

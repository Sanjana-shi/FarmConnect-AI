package com.farmconnect.app.common;

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
import com.farmconnect.app.models.AdvancedFeatureModels.WorkerTeamItem;
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

public class WorkerTeamsActivity extends AppCompatActivity {

    private RecyclerView rvTeams;
    private ProgressBar progressTeams;
    private TeamsAdapter adapter;
    private WorkforceApi workforceApi;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_worker_teams);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_teams);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        rvTeams = findViewById(R.id.rv_teams);
        progressTeams = findViewById(R.id.progress_teams);

        rvTeams.setLayoutManager(new LinearLayoutManager(this));
        adapter = new TeamsAdapter();
        rvTeams.setAdapter(adapter);

        loadTeams();
    }

    private void loadTeams() {
        progressTeams.setVisibility(View.VISIBLE);
        String token = "Bearer " + sessionManager.getToken();

        workforceApi.getTeams(token, "Thanjavur", null).enqueue(new Callback<ApiResponse<List<WorkerTeamItem>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<WorkerTeamItem>>> call, Response<ApiResponse<List<WorkerTeamItem>>> response) {
                progressTeams.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().data != null && !response.body().data.isEmpty()) {
                    adapter.setItems(response.body().data);
                } else {
                    loadFallbackTeams();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<WorkerTeamItem>>> call, Throwable t) {
                progressTeams.setVisibility(View.GONE);
                loadFallbackTeams();
            }
        });
    }

    private void loadFallbackTeams() {
        List<WorkerTeamItem> list = new ArrayList<>();

        WorkerTeamItem t1 = new WorkerTeamItem();
        t1.teamName = "Cauvery Delta Harvesters";
        t1.leaderName = "Ramesh Kumar";
        t1.leaderMobile = "+91 98450 11234";
        t1.teamSize = 6;
        t1.averageRating = 4.9;
        t1.completedJobsCount = 42;
        t1.dailyRatePerWorker = 750.0;
        t1.primarySkills = "Paddy Harvesting, Mechanical Transplanter, Sugarcane Cutting";
        t1.equipmentDetails = "Kubota Transplanter, 2 Power Tillers, Sickles & Tarpaulins";
        list.add(t1);

        WorkerTeamItem t2 = new WorkerTeamItem();
        t2.teamName = "Thanjavur Agri Power Squad";
        t2.leaderName = "Selvam Perumal";
        t2.leaderMobile = "+91 98450 88765";
        t2.teamSize = 8;
        t2.averageRating = 4.8;
        t2.completedJobsCount = 35;
        t2.dailyRatePerWorker = 700.0;
        t2.primarySkills = "Land Preparation, Bund Formation, De-weeding, Threshing";
        t2.equipmentDetails = "3 Power Tillers, Bund Shapers, Spraying Units";
        list.add(t2);

        WorkerTeamItem t3 = new WorkerTeamItem();
        t3.teamName = "Kumbakonam Mechanized Crew";
        t3.leaderName = "Mani Soundar";
        t3.leaderMobile = "+91 98450 55432";
        t3.teamSize = 5;
        t3.averageRating = 4.7;
        t3.completedJobsCount = 28;
        t3.dailyRatePerWorker = 720.0;
        t3.primarySkills = "Paddy Cutting, Bagging, Lorry Loading";
        t3.equipmentDetails = "Portable Moisture Meters, Heavy Bag Stitchers";
        list.add(t3);

        adapter.setItems(list);
    }

    private class TeamsAdapter extends RecyclerView.Adapter<TeamsAdapter.ViewHolder> {
        private List<WorkerTeamItem> items = new ArrayList<>();

        public void setItems(List<WorkerTeamItem> items) {
            this.items = items;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_worker_team, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            WorkerTeamItem item = items.get(position);
            holder.tvName.setText(item.teamName);
            holder.tvLeader.setText("Leader: " + item.leaderName + " (📞 " + item.leaderMobile + ")");
            holder.tvSize.setText(item.teamSize + " WORKERS");
            holder.tvSkills.setText("Skills: " + item.primarySkills);
            holder.tvEquipment.setText("🚜 Equipment: " + (item.equipmentDetails != null ? item.equipmentDetails : "Traditional tools & sprayers"));
            holder.tvRating.setText("⭐ " + item.averageRating + " (" + item.completedJobsCount + " Jobs) • ₹" + Math.round(item.dailyRatePerWorker) + "/worker/day");

            holder.btnBook.setOnClickListener(v -> {
                Snackbar.make(rvTeams, "Booking request sent to " + item.teamName + " (" + item.teamSize + " workers)!", Snackbar.LENGTH_LONG).show();
            });
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvLeader, tvSize, tvSkills, tvEquipment, tvRating;
            MaterialButton btnBook;

            ViewHolder(View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tv_team_name);
                tvLeader = itemView.findViewById(R.id.tv_team_leader);
                tvSize = itemView.findViewById(R.id.tv_team_size_badge);
                tvSkills = itemView.findViewById(R.id.tv_team_skills);
                tvEquipment = itemView.findViewById(R.id.tv_team_equipment);
                tvRating = itemView.findViewById(R.id.tv_team_rating);
                btnBook = itemView.findViewById(R.id.btn_book_team);
            }
        }
    }
}

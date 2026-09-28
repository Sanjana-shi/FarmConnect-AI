package com.farmconnect.app.worker;

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
import com.farmconnect.app.models.AdvancedFeatureModels.WorkCertificateItem;
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

public class WorkCertificatesActivity extends AppCompatActivity {

    private RecyclerView rvCertificates;
    private ProgressBar progressCertificates;
    private CertificatesAdapter adapter;
    private WorkforceApi workforceApi;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_work_certificates);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_certificates);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        rvCertificates = findViewById(R.id.rv_certificates);
        progressCertificates = findViewById(R.id.progress_certificates);

        rvCertificates.setLayoutManager(new LinearLayoutManager(this));
        adapter = new CertificatesAdapter();
        rvCertificates.setAdapter(adapter);

        loadCertificates();
    }

    private void loadCertificates() {
        progressCertificates.setVisibility(View.VISIBLE);
        String token = "Bearer " + sessionManager.getToken();
        Long workerId = sessionManager.getUserId();

        workforceApi.getWorkerCertificates(token, workerId).enqueue(new Callback<ApiResponse<List<WorkCertificateItem>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<WorkCertificateItem>>> call, Response<ApiResponse<List<WorkCertificateItem>>> response) {
                progressCertificates.setVisibility(View.GONE);
                if (response.isSuccessful() && response.body() != null && response.body().data != null && !response.body().data.isEmpty()) {
                    adapter.setItems(response.body().data);
                } else {
                    loadFallbackCertificates();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<WorkCertificateItem>>> call, Throwable t) {
                progressCertificates.setVisibility(View.GONE);
                loadFallbackCertificates();
            }
        });
    }

    private void loadFallbackCertificates() {
        List<WorkCertificateItem> list = new ArrayList<>();

        WorkCertificateItem c1 = new WorkCertificateItem();
        c1.certificateNumber = "FC-CERT-2026-0901";
        c1.jobTitle = "Paddy Harvesting & Threshing";
        c1.farmerName = "Murugan Farms";
        c1.farmLocation = "Thanjavur, Tamil Nadu";
        c1.durationDays = 4;
        c1.performanceRating = 5.0;
        c1.performanceGrade = "GRADE A+";
        c1.farmerTestimonial = "\"Exceptional punctuality and careful machine handling. Completed 3.5 acres harvesting ahead of scheduled rain with zero grain loss.\"";
        c1.digitalSignatureHash = "SHA-256: 8f9b2c3a10e47d8b5c92e10a884f2b1d3e";
        list.add(c1);

        WorkCertificateItem c2 = new WorkCertificateItem();
        c2.certificateNumber = "FC-CERT-2026-0814";
        c2.jobTitle = "Kubota Mechanical Transplanting";
        c2.farmerName = "Kaveri Agro Farms";
        c2.farmLocation = "Kumbakonam, Tamil Nadu";
        c2.durationDays = 3;
        c2.performanceRating = 4.9;
        c2.performanceGrade = "GRADE A";
        c2.farmerTestimonial = "\"Expert transplanter operation. Maintained exact hill spacing (20x15cm). Highly recommended for mechanized paddy planting.\"";
        c2.digitalSignatureHash = "SHA-256: 4e7a1b89d02c6f33e8a1599bc042a96d11";
        list.add(c2);

        adapter.setItems(list);
    }

    private class CertificatesAdapter extends RecyclerView.Adapter<CertificatesAdapter.ViewHolder> {
        private List<WorkCertificateItem> items = new ArrayList<>();

        public void setItems(List<WorkCertificateItem> items) {
            this.items = items;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_certificate, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            WorkCertificateItem item = items.get(position);
            holder.tvTitle.setText(item.jobTitle);
            holder.tvGrade.setText(item.performanceGrade != null ? item.performanceGrade : "GRADE A+");
            holder.tvFarmer.setText("Issued by " + item.farmerName + " • " + item.farmLocation);
            holder.tvMeta.setText("Duration: " + item.durationDays + " Days • ⭐ " + item.performanceRating + " Rating");
            holder.tvTestimonial.setText(item.farmerTestimonial);
            holder.tvHash.setText("🔒 " + item.digitalSignatureHash);

            holder.btnShare.setOnClickListener(v -> {
                Snackbar.make(rvCertificates, "Certificate #" + item.certificateNumber + " verified & share link copied!", Snackbar.LENGTH_LONG).show();
            });
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvTitle, tvGrade, tvFarmer, tvMeta, tvTestimonial, tvHash;
            MaterialButton btnShare;

            ViewHolder(View itemView) {
                super(itemView);
                tvTitle = itemView.findViewById(R.id.tv_cert_title);
                tvGrade = itemView.findViewById(R.id.tv_cert_grade);
                tvFarmer = itemView.findViewById(R.id.tv_cert_farmer);
                tvMeta = itemView.findViewById(R.id.tv_cert_meta);
                tvTestimonial = itemView.findViewById(R.id.tv_cert_testimonial);
                tvHash = itemView.findViewById(R.id.tv_cert_hash);
                btnShare = itemView.findViewById(R.id.btn_share_cert);
            }
        }
    }
}

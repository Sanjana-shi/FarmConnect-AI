package com.farmconnect.app.common;

import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.farmconnect.app.R;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.WorkforceApi;
import com.farmconnect.app.models.AdvancedFeatureModels.JobMessageItem;
import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.chip.Chip;
import com.google.android.material.textfield.TextInputEditText;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class JobMessagingActivity extends AppCompatActivity {

    private RecyclerView rvMessages;
    private TextInputEditText etMessageInput;
    private MaterialButton btnSendMessage;
    private MessagesAdapter adapter;
    private WorkforceApi workforceApi;
    private SessionManager sessionManager;
    private Long currentJobId = 101L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_job_messaging);

        workforceApi = ApiClient.getWorkforceApi();
        sessionManager = new SessionManager(this);

        MaterialToolbar toolbar = findViewById(R.id.toolbar_messaging);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(v -> finish());
        }

        rvMessages = findViewById(R.id.rv_messages);
        etMessageInput = findViewById(R.id.et_message_input);
        btnSendMessage = findViewById(R.id.btn_send_message);

        rvMessages.setLayoutManager(new LinearLayoutManager(this));
        adapter = new MessagesAdapter();
        rvMessages.setAdapter(adapter);

        setupQuickChips();
        btnSendMessage.setOnClickListener(v -> sendMessage());

        loadMessages();
    }

    private void setupQuickChips() {
        Chip cTime = findViewById(R.id.chip_arrival_time);
        Chip cLoc = findViewById(R.id.chip_location);
        Chip cFood = findViewById(R.id.chip_food);
        Chip cTools = findViewById(R.id.chip_tools);

        cTime.setOnClickListener(v -> etMessageInput.setText("What time should we arrive at the field tomorrow?"));
        cLoc.setOnClickListener(v -> etMessageInput.setText("Could you share the nearest landmark to the field entrance?"));
        cFood.setOnClickListener(v -> etMessageInput.setText("Is drinking water and noon meal arranged at the field?"));
        cTools.setOnClickListener(v -> etMessageInput.setText("Should we bring our own sickles and harvesting mats?"));
    }

    private void sendMessage() {
        String text = etMessageInput.getText() != null ? etMessageInput.getText().toString().trim() : "";
        if (text.isEmpty()) return;

        etMessageInput.setText("");
        JobMessageItem msg = new JobMessageItem();
        msg.jobId = currentJobId;
        msg.senderUserId = sessionManager.getUserId();
        msg.senderName = "FARMER".equalsIgnoreCase(sessionManager.getRole()) ? "Murugan Farms" : "Ramesh Kumar";
        msg.senderRole = sessionManager.getRole();
        msg.messageText = text;
        msg.sentAt = new SimpleDateFormat("hh:mm a", Locale.getDefault()).format(new Date());

        adapter.addMessage(msg);
        rvMessages.scrollToPosition(adapter.getItemCount() - 1);

        String token = "Bearer " + sessionManager.getToken();
        workforceApi.sendMessage(token, currentJobId, sessionManager.getUserId(), text, false, null).enqueue(new Callback<ApiResponse<JobMessageItem>>() {
            @Override
            public void onResponse(Call<ApiResponse<JobMessageItem>> call, Response<ApiResponse<JobMessageItem>> response) {}

            @Override
            public void onFailure(Call<ApiResponse<JobMessageItem>> call, Throwable t) {}
        });
    }

    private void loadMessages() {
        String token = "Bearer " + sessionManager.getToken();
        workforceApi.getJobMessages(token, currentJobId).enqueue(new Callback<ApiResponse<List<JobMessageItem>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<JobMessageItem>>> call, Response<ApiResponse<List<JobMessageItem>>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().data != null && !response.body().data.isEmpty()) {
                    adapter.setItems(response.body().data);
                } else {
                    loadFallbackMessages();
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<JobMessageItem>>> call, Throwable t) {
                loadFallbackMessages();
            }
        });
    }

    private void loadFallbackMessages() {
        List<JobMessageItem> list = new ArrayList<>();

        JobMessageItem m1 = new JobMessageItem();
        m1.senderName = "Murugan Farms";
        m1.senderRole = "FARMER";
        m1.messageText = "Namaste Ramesh. We need to complete 3.5 acres harvesting before Sunday rain.";
        m1.sentAt = "Yesterday 05:30 PM";
        list.add(m1);

        JobMessageItem m2 = new JobMessageItem();
        m2.senderName = "Ramesh Kumar";
        m2.senderRole = "WORKER";
        m2.messageText = "Vanakkam Ayya. My 6-member team with 2 power tillers is confirmed. What time should we arrive?";
        m2.sentAt = "Yesterday 06:15 PM";
        list.add(m2);

        JobMessageItem m3 = new JobMessageItem();
        m3.senderName = "Murugan Farms";
        m3.senderRole = "FARMER";
        m3.messageText = "Please arrive by 6:30 AM at the East Gate near the large banyan tree. Hot breakfast & tea will be provided.";
        m3.sentAt = "Yesterday 06:22 PM";
        list.add(m3);

        adapter.setItems(list);
        rvMessages.scrollToPosition(list.size() - 1);
    }

    private class MessagesAdapter extends RecyclerView.Adapter<MessagesAdapter.ViewHolder> {
        private List<JobMessageItem> items = new ArrayList<>();

        public void setItems(List<JobMessageItem> items) {
            this.items = items;
            notifyDataSetChanged();
        }

        public void addMessage(JobMessageItem item) {
            this.items.add(item);
            notifyItemInserted(items.size() - 1);
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_job_message, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            JobMessageItem item = items.get(position);
            holder.tvSender.setText(item.senderName != null ? item.senderName : "FarmConnect User");
            holder.tvText.setText(item.messageText);
            holder.tvTime.setText(item.sentAt != null ? item.sentAt : "Just now");

            boolean isMe = "FARMER".equalsIgnoreCase(sessionManager.getRole())
                    ? "FARMER".equalsIgnoreCase(item.senderRole)
                    : "WORKER".equalsIgnoreCase(item.senderRole);

            LinearLayout.LayoutParams lp = (LinearLayout.LayoutParams) holder.layoutBubble.getLayoutParams();
            if (isMe) {
                lp.gravity = Gravity.END;
                holder.layoutBubble.setBackgroundColor(0xFFDCFCE7); // Light green
            } else {
                lp.gravity = Gravity.START;
                holder.layoutBubble.setBackgroundColor(0xFFF1F5F9); // Slate light
            }
            holder.layoutBubble.setLayoutParams(lp);
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            LinearLayout layoutBubble;
            TextView tvSender, tvText, tvTime;

            ViewHolder(View itemView) {
                super(itemView);
                layoutBubble = itemView.findViewById(R.id.layout_message_bubble);
                tvSender = itemView.findViewById(R.id.tv_msg_sender);
                tvText = itemView.findViewById(R.id.tv_msg_text);
                tvTime = itemView.findViewById(R.id.tv_msg_time);
            }
        }
    }
}

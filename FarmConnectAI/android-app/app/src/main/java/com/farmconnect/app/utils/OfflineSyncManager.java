package com.farmconnect.app.utils;

import android.content.Context;
import android.content.SharedPreferences;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.api.WorkforceApi;
import com.farmconnect.app.models.AdvancedFeatureModels.OfflineSyncAction;
import com.farmconnect.app.models.AdvancedFeatureModels.OfflineSyncBatchRequest;
import com.farmconnect.app.models.AdvancedFeatureModels.OfflineSyncResult;
import com.farmconnect.app.models.ApiResponse;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OfflineSyncManager {

    private static final String PREF_NAME = "farmconnect_offline_queue";
    private static final String KEY_QUEUE = "pending_actions";

    private final SharedPreferences prefs;
    private final Gson gson = new Gson();
    private final WorkforceApi workforceApi;
    private final SessionManager sessionManager;

    public OfflineSyncManager(Context context) {
        this.prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        this.workforceApi = ApiClient.getWorkforceApi();
        this.sessionManager = new SessionManager(context);
    }

    public synchronized void queueAction(String actionType, Object payload) {
        List<OfflineSyncAction> queue = getPendingActions();
        String json = gson.toJson(payload);
        OfflineSyncAction action = new OfflineSyncAction(
                UUID.randomUUID().toString(),
                actionType,
                json,
                System.currentTimeMillis()
        );
        queue.add(action);
        saveQueue(queue);
    }

    public synchronized List<OfflineSyncAction> getPendingActions() {
        String json = prefs.getString(KEY_QUEUE, "[]");
        Type type = new TypeToken<List<OfflineSyncAction>>(){}.getType();
        List<OfflineSyncAction> list = gson.fromJson(json, type);
        return list != null ? list : new ArrayList<>();
    }

    private synchronized void saveQueue(List<OfflineSyncAction> queue) {
        prefs.edit().putString(KEY_QUEUE, gson.toJson(queue)).apply();
    }

    public synchronized void syncPendingActions(SyncCallback callback) {
        List<OfflineSyncAction> pending = getPendingActions();
        if (pending.isEmpty()) {
            if (callback != null) callback.onSyncComplete(0);
            return;
        }

        String token = "Bearer " + sessionManager.getToken();
        OfflineSyncBatchRequest batch = new OfflineSyncBatchRequest(pending);

        workforceApi.syncOffline(token, batch).enqueue(new Callback<ApiResponse<List<OfflineSyncResult>>>() {
            @Override
            public void onResponse(Call<ApiResponse<List<OfflineSyncResult>>> call, Response<ApiResponse<List<OfflineSyncResult>>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    saveQueue(new ArrayList<>()); // Clear synced actions
                    if (callback != null) callback.onSyncComplete(pending.size());
                } else {
                    if (callback != null) callback.onSyncFailed("Server error during sync");
                }
            }

            @Override
            public void onFailure(Call<ApiResponse<List<OfflineSyncResult>>> call, Throwable t) {
                if (callback != null) callback.onSyncFailed(t.getMessage());
            }
        });
    }

    public interface SyncCallback {
        void onSyncComplete(int syncedCount);
        void onSyncFailed(String error);
    }
}

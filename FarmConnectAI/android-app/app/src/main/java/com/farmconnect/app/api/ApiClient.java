package com.farmconnect.app.api;

import android.content.Context;
import com.farmconnect.app.utils.SessionManager;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import java.util.concurrent.TimeUnit;

public class ApiClient {

    // Default Spring Boot backend URL (10.0.2.2 for Android Emulator, or live container URL)
    public static final String DEFAULT_BASE_URL = "http://10.0.2.2:8080/";
    private static String currentBaseUrl = DEFAULT_BASE_URL;
    private static Retrofit retrofit = null;
    private static OkHttpClient okHttpClient = null;

    public static synchronized void init(Context context) {
        if (context != null) {
            SessionManager sessionManager = new SessionManager(context.getApplicationContext());
            String savedUrl = sessionManager.getBackendUrl();
            if (savedUrl != null && !savedUrl.trim().isEmpty()) {
                setBaseUrl(savedUrl);
            }
        }
    }

    public static synchronized void setBaseUrl(String newUrl) {
        if (newUrl == null || newUrl.trim().isEmpty()) return;
        String formatted = newUrl.trim();
        if (!formatted.endsWith("/")) {
            formatted += "/";
        }
        if (!formatted.equals(currentBaseUrl)) {
            currentBaseUrl = formatted;
            retrofit = null; // Forces rebuild with updated URL
        }
    }

    public static synchronized String getBaseUrl() {
        return currentBaseUrl;
    }

    public static synchronized OkHttpClient getOkHttpClient() {
        if (okHttpClient == null) {
            HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
            interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

            okHttpClient = new OkHttpClient.Builder()
                    .addInterceptor(interceptor)
                    .connectTimeout(10, TimeUnit.SECONDS)
                    .readTimeout(15, TimeUnit.SECONDS)
                    .writeTimeout(15, TimeUnit.SECONDS)
                    .retryOnConnectionFailure(true)
                    .build();
        }
        return okHttpClient;
    }

    public static synchronized Retrofit getClient() {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(currentBaseUrl)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(getOkHttpClient())
                    .build();
        }
        return retrofit;
    }

    public static AuthApi getAuthApi() {
        return getClient().create(AuthApi.class);
    }

    public static WorkforceApi getWorkforceApi() {
        return getClient().create(WorkforceApi.class);
    }

    public static HealthApi getHealthApi() {
        return getClient().create(HealthApi.class);
    }

    public static String parseErrorMessage(retrofit2.Response<?> response, String fallback) {
        try {
            if (response != null && response.errorBody() != null) {
                String errorJson = response.errorBody().string();
                com.google.gson.JsonObject json = com.google.gson.JsonParser.parseString(errorJson).getAsJsonObject();
                if (json.has("message") && !json.get("message").isJsonNull()) {
                    return json.get("message").getAsString();
                }
            }
        } catch (Exception ignored) {}
        return fallback;
    }
}

package com.farmconnect.app.api;

import retrofit2.Call;
import retrofit2.http.GET;

import java.util.Map;

public interface HealthApi {

    @GET("api/health")
    Call<Map<String, Object>> getHealth();
}

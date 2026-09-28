package com.farmconnect.app.api;

import com.farmconnect.app.models.ApiResponse;
import com.farmconnect.app.models.AuthResponse;
import com.farmconnect.app.models.RegisterFarmerRequest;
import com.farmconnect.app.models.RegisterWorkerRequest;
import com.farmconnect.app.models.SendOtpRequest;
import com.farmconnect.app.models.VerifyOtpRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface AuthApi {

    @POST("api/auth/send-otp")
    Call<ApiResponse<String>> sendOtp(@Body SendOtpRequest request);

    @POST("api/auth/verify-otp")
    Call<ApiResponse<AuthResponse>> verifyOtp(@Body VerifyOtpRequest request);

    @POST("api/auth/register/farmer")
    Call<ApiResponse<AuthResponse>> registerFarmer(@Body RegisterFarmerRequest request);

    @POST("api/auth/register/worker")
    Call<ApiResponse<AuthResponse>> registerWorker(@Body RegisterWorkerRequest request);
}

package com.farmconnect.app.models;

import com.google.gson.annotations.SerializedName;

public class AuthResponse {
    @SerializedName("token")
    private String token;

    @SerializedName("tokenType")
    private String tokenType;

    @SerializedName("userId")
    private Long userId;

    @SerializedName("mobileNumber")
    private String mobileNumber;

    @SerializedName("fullName")
    private String fullName;

    @SerializedName("role")
    private String role;

    @SerializedName("preferredLanguage")
    private String preferredLanguage;

    @SerializedName("registered")
    private boolean isRegistered;

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getMobileNumber() { return mobileNumber; }
    public String getFullName() { return fullName; }
    public String getRole() { return role; }
    public String getPreferredLanguage() { return preferredLanguage; }
    public boolean isRegistered() { return isRegistered; }
}

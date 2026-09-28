package com.farmconnect.app.models;

import com.google.gson.annotations.SerializedName;

public class VerifyOtpRequest {
    @SerializedName("mobileNumber")
    private String mobileNumber;

    @SerializedName("otpCode")
    private String otpCode;

    public VerifyOtpRequest(String mobileNumber, String otpCode) {
        this.mobileNumber = mobileNumber;
        this.otpCode = otpCode;
    }

    public String getMobileNumber() { return mobileNumber; }
    public String getOtpCode() { return otpCode; }
}

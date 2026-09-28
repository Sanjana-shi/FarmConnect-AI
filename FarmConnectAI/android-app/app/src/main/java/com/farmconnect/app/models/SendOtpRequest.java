package com.farmconnect.app.models;

import com.google.gson.annotations.SerializedName;

public class SendOtpRequest {
    @SerializedName("mobileNumber")
    private String mobileNumber;

    public SendOtpRequest(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getMobileNumber() { return mobileNumber; }
}

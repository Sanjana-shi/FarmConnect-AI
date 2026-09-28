package com.farmconnect.app.models;

import com.google.gson.annotations.SerializedName;
import java.math.BigDecimal;
import java.util.List;

public class RegisterFarmerRequest {
    @SerializedName("mobileNumber") private String mobileNumber;
    @SerializedName("fullName") private String fullName;
    @SerializedName("villageOrTown") private String villageOrTown;
    @SerializedName("district") private String district;
    @SerializedName("state") private String state;
    @SerializedName("preferredLanguage") private String preferredLanguage;
    @SerializedName("farmSizeAcres") private BigDecimal farmSizeAcres;
    @SerializedName("mainCrops") private List<String> mainCrops;
    @SerializedName("farmAddress") private String farmAddress;

    public RegisterFarmerRequest(String mobileNumber, String fullName, String villageOrTown,
                                 String district, String state, String preferredLanguage,
                                 BigDecimal farmSizeAcres, List<String> mainCrops, String farmAddress) {
        this.mobileNumber = mobileNumber;
        this.fullName = fullName;
        this.villageOrTown = villageOrTown;
        this.district = district;
        this.state = state;
        this.preferredLanguage = preferredLanguage;
        this.farmSizeAcres = farmSizeAcres;
        this.mainCrops = mainCrops;
        this.farmAddress = farmAddress;
    }
}

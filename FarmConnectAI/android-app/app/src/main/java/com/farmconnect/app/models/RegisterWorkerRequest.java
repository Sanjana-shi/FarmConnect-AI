package com.farmconnect.app.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class RegisterWorkerRequest {
    @SerializedName("mobileNumber") private String mobileNumber;
    @SerializedName("fullName") private String fullName;
    @SerializedName("villageOrTown") private String villageOrTown;
    @SerializedName("district") private String district;
    @SerializedName("state") private String state;
    @SerializedName("preferredLanguage") private String preferredLanguage;
    @SerializedName("experienceYears") private Integer experienceYears;
    @SerializedName("skills") private List<String> skills;
    @SerializedName("availabilityStatus") private String availabilityStatus;

    public RegisterWorkerRequest(String mobileNumber, String fullName, String villageOrTown,
                                 String district, String state, String preferredLanguage,
                                 Integer experienceYears, List<String> skills, String availabilityStatus) {
        this.mobileNumber = mobileNumber;
        this.fullName = fullName;
        this.villageOrTown = villageOrTown;
        this.district = district;
        this.state = state;
        this.preferredLanguage = preferredLanguage;
        this.experienceYears = experienceYears;
        this.skills = skills;
        this.availabilityStatus = availabilityStatus;
    }
}

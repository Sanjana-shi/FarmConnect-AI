package com.farmconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterFarmerRequest {

    @NotBlank(message = "Mobile number is required")
    private String mobileNumber;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Village/Town is required")
    private String villageOrTown;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    private String preferredLanguage;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @NotNull(message = "Farm size is required")
    @Positive(message = "Farm size must be positive")
    private BigDecimal farmSizeAcres;

    @NotEmpty(message = "At least one crop must be selected")
    private List<String> mainCrops;

    private String farmAddress;
}

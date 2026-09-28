package com.farmconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterWorkerRequest {

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

    @NotNull(message = "Experience years is required")
    @PositiveOrZero(message = "Experience cannot be negative")
    private Integer experienceYears;

    @NotEmpty(message = "At least one skill is required")
    private List<String> skills;

    private String availabilityStatus; // AVAILABLE, BUSY, AVAILABLE_FROM_DATE
    private LocalDate availableFromDate;
}

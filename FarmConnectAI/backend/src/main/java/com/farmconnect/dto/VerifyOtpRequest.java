package com.farmconnect.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequest {

    @NotBlank(message = "Mobile number is required")
    @JsonAlias({"mobile", "phone", "mobile_number"})
    private String mobileNumber;

    @NotBlank(message = "OTP code is required")
    @JsonAlias({"otp", "otp_code", "code"})
    private String otpCode;
}

package com.farmconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String mobileNumber;
    private String fullName;
    private String role;
    private String preferredLanguage;
    private boolean isRegistered;
    private String message;
}

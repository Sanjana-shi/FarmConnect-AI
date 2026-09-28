package com.farmconnect.controller;

import com.farmconnect.dto.*;
import com.farmconnect.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        ApiResponse<String> response = authService.sendOtp(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        ApiResponse<AuthResponse> response = authService.verifyOtp(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/farmer")
    public ResponseEntity<ApiResponse<AuthResponse>> registerFarmer(@Valid @RequestBody RegisterFarmerRequest request) {
        ApiResponse<AuthResponse> response = authService.registerFarmer(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/worker")
    public ResponseEntity<ApiResponse<AuthResponse>> registerWorker(@Valid @RequestBody RegisterWorkerRequest request) {
        ApiResponse<AuthResponse> response = authService.registerWorker(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}

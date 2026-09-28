package com.farmconnect.controller;

import com.farmconnect.dto.ApiResponse;
import com.farmconnect.dto.FarmerDashboardDto;
import com.farmconnect.service.FarmerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FarmerController {

    private final FarmerService farmerService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<FarmerDashboardDto>> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        FarmerDashboardDto dashboard = farmerService.getDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Farmer dashboard fetched successfully", dashboard));
    }
}

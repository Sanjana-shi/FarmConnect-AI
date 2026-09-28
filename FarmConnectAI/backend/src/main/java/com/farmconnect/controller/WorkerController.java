package com.farmconnect.controller;

import com.farmconnect.dto.ApiResponse;
import com.farmconnect.dto.WorkerDashboardDto;
import com.farmconnect.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('WORKER', 'ADMIN')")
    public ResponseEntity<ApiResponse<WorkerDashboardDto>> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        WorkerDashboardDto dashboard = workerService.getDashboard(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Worker dashboard fetched successfully", dashboard));
    }
}

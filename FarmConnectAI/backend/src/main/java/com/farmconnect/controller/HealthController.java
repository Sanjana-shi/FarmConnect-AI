package com.farmconnect.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    private final DataSource dataSource;
    private final RestTemplate restTemplate;

    @Value("${ml.service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public HealthController(DataSource dataSource, RestTemplate restTemplate) {
        this.dataSource = dataSource;
        this.restTemplate = restTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "FarmConnect AI Backend");
        response.put("timestamp", Instant.now().toString());

        // Check Database
        Map<String, Object> dbHealth = new HashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(2);
            dbHealth.put("status", valid ? "UP" : "DOWN");
            dbHealth.put("database", conn.getMetaData().getDatabaseProductName());
        } catch (Exception e) {
            dbHealth.put("status", "DOWN");
            dbHealth.put("error", e.getMessage());
        }
        response.put("database", dbHealth);

        // Check ML Microservice
        Map<String, Object> mlHealth = new HashMap<>();
        try {
            String mlPingUrl = mlServiceUrl + "/health";
            ResponseEntity<String> mlResp = restTemplate.getForEntity(mlPingUrl, String.class);
            if (mlResp.getStatusCode().is2xxSuccessful()) {
                mlHealth.put("status", "UP");
                mlHealth.put("url", mlServiceUrl);
            } else {
                mlHealth.put("status", "DEGRADED");
                mlHealth.put("statusCode", mlResp.getStatusCode().value());
            }
        } catch (Exception e) {
            mlHealth.put("status", "UNAVAILABLE");
            mlHealth.put("url", mlServiceUrl);
            mlHealth.put("message", "ML service not reachable on configured port or host");
        }
        response.put("mlService", mlHealth);

        return ResponseEntity.ok(response);
    }
}

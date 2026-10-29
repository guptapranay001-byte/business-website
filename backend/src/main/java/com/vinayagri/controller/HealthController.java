package com.vinayagri.controller;

import com.vinayagri.dto.ApiResponse;
import com.vinayagri.dto.HealthStatusDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final List<String> MANAGED_FIRMS = List.of(
            "Vinay Agri Inputs",
            "Gupta Traders and Auto Agencies",
            "Vinay Khad Beej Bhandaar",
            "Gupta Traders, Tonk"
    );

    @GetMapping
    public ResponseEntity<ApiResponse<HealthStatusDto>> getHealthStatus() {
        HealthStatusDto health = new HealthStatusDto(
                "UP",
                "Vinay Agri Inputs Multi-Firm Management Platform",
                "1.0.0-SNAPSHOT",
                "Tonk, Rajasthan, India",
                MANAGED_FIRMS
        );
        return ResponseEntity.ok(ApiResponse.success("Backend service is operational", health));
    }
}

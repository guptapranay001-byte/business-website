package com.vinayagri.controller;

import com.vinayagri.dto.ApiResponse;
import com.vinayagri.dto.FirmResponseDto;
import com.vinayagri.service.FirmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/firms")
public class FirmController {

    private final FirmService firmService;

    // Constructor-based dependency injection
    public FirmController(FirmService firmService) {
        this.firmService = firmService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FirmResponseDto>>> getAllActiveFirms() {
        List<FirmResponseDto> firms = firmService.getAllActiveFirms();
        return ResponseEntity.ok(ApiResponse.success("Active firms retrieved successfully", firms));
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResponse<FirmResponseDto>> getFirmByCode(@PathVariable String code) {
        FirmResponseDto firm = firmService.getFirmByCode(code.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Firm details retrieved successfully", firm));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ApiResponse<FirmResponseDto>> getFirmById(@PathVariable Long id) {
        FirmResponseDto firm = firmService.getFirmById(id);
        return ResponseEntity.ok(ApiResponse.success("Firm details retrieved successfully", firm));
    }
}

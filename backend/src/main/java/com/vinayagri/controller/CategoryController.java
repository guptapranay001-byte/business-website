package com.vinayagri.controller;

import com.vinayagri.dto.ApiResponse;
import com.vinayagri.dto.CategoryResponseDto;
import com.vinayagri.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getAllActiveCategories() {
        List<CategoryResponseDto> categories = categoryService.getAllActiveCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> getCategoryById(@PathVariable Long id) {
        CategoryResponseDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category details retrieved successfully", category));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> getCategoryByCode(@PathVariable String code) {
        CategoryResponseDto category = categoryService.getCategoryByCode(code.toLowerCase());
        return ResponseEntity.ok(ApiResponse.success("Category details retrieved successfully", category));
    }
}

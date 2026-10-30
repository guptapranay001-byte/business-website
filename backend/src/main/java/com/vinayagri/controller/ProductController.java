package com.vinayagri.controller;

import com.vinayagri.dto.ApiResponse;
import com.vinayagri.dto.PagedResponse;
import com.vinayagri.dto.ProductResponseDto;
import com.vinayagri.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long firmId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        if (page != null || size != null) {
            int pageNumber = (page != null && page >= 0) ? page : 0;
            int pageSize = (size != null && size > 0) ? size : 20;
            PagedResponse<ProductResponseDto> pagedProducts = productService.getProductsPaged(categoryId, firmId, pageNumber, pageSize);
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", pagedProducts));
        }

        List<ProductResponseDto> products = productService.getAllProducts(categoryId, firmId);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductById(@PathVariable Long id) {
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product details retrieved successfully", product));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductBySku(@PathVariable String sku) {
        ProductResponseDto product = productService.getProductBySku(sku);
        return ResponseEntity.ok(ApiResponse.success("Product details retrieved successfully", product));
    }
}

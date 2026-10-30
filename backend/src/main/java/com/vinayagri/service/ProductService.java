package com.vinayagri.service;

import com.vinayagri.dto.PagedResponse;
import com.vinayagri.dto.ProductResponseDto;
import java.util.List;

public interface ProductService {
    List<ProductResponseDto> getAllProducts(Long categoryId, Long firmId);
    PagedResponse<ProductResponseDto> getProductsPaged(Long categoryId, Long firmId, int page, int size);
    ProductResponseDto getProductById(Long id);
    ProductResponseDto getProductBySku(String sku);
}

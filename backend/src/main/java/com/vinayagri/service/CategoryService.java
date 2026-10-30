package com.vinayagri.service;

import com.vinayagri.dto.CategoryResponseDto;
import java.util.List;

public interface CategoryService {
    List<CategoryResponseDto> getAllActiveCategories();
    CategoryResponseDto getCategoryById(Long id);
    CategoryResponseDto getCategoryByCode(String code);
    void initializeDefaultCategoriesIfEmpty();
}

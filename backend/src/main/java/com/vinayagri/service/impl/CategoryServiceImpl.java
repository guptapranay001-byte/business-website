package com.vinayagri.service.impl;

import com.vinayagri.dto.CategoryResponseDto;
import com.vinayagri.entity.Category;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.CategoryRepository;
import com.vinayagri.service.CategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryServiceImpl.class);
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getAllActiveCategories() {
        return categoryRepository.findByActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapToDto(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDto getCategoryByCode(String code) {
        Category category = categoryRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "code", code));
        return mapToDto(category);
    }

    @Override
    public void initializeDefaultCategoriesIfEmpty() {
        if (categoryRepository.count() == 0) {
            log.info("Initializing baseline agricultural categories for Vinay Agri Inputs...");

            List<Category> categories = List.of(
                    new Category(null, "Seeds", "seeds", "Certified hybrid and high-yield seeds for cereals, oilseeds, and vegetables.", null, true),
                    new Category(null, "Fertilizers", "fertilizers", "Soil nutrients, water-soluble grades, and primary macro-fertilizers.", null, true),
                    new Category(null, "Insecticides", "insecticides", "Targeted pest control solutions for chewing, sucking, and borer pests.", null, true),
                    new Category(null, "Fungicides", "fungicides", "Preventive and curative antifungal treatments for root, foliar, and seed diseases.", null, true),
                    new Category(null, "Herbicides", "herbicides", "Selective and non-selective weed control solutions for kharif and rabi seasons.", null, true),
                    new Category(null, "Plant Growth Regulators", "plant-growth-regulators", "Hormonal boosters, flowering stimulants, and yield enhancers.", null, true),
                    new Category(null, "Micronutrients", "micronutrients", "Zinc, boron, iron, and chelates for overcoming regional soil deficiencies.", null, true),
                    new Category(null, "Plant Nutrition", "plant-nutrition", "Organic matter, bio-stimulants, and liquid balanced fertigation formulas.", null, true),
                    new Category(null, "Other Agricultural Inputs", "other-agricultural-inputs", "Agricultural equipment, spray pumps, safety kits, and tractor implement parts.", null, true)
            );

            categoryRepository.saveAll(categories);
            log.info("Baseline agricultural categories initialized successfully.");
        }
    }

    private CategoryResponseDto mapToDto(Category category) {
        CategoryResponseDto dto = new CategoryResponseDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setCode(category.getCode());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        dto.setActive(category.isActive());
        return dto;
    }
}

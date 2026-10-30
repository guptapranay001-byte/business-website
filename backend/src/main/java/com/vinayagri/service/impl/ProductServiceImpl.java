package com.vinayagri.service.impl;

import com.vinayagri.dto.PagedResponse;
import com.vinayagri.dto.ProductResponseDto;
import com.vinayagri.entity.Product;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.ProductRepository;
import com.vinayagri.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductResponseDto> getAllProducts(Long categoryId, Long firmId) {
        List<Product> products;
        if (categoryId != null && firmId != null) {
            products = productRepository.findByCategoryIdAndFirmIdAndActiveTrue(categoryId, firmId);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryIdAndActiveTrue(categoryId);
        } else if (firmId != null) {
            products = productRepository.findByFirmIdAndActiveTrue(firmId);
        } else {
            products = productRepository.findByActiveTrue();
        }
        return products.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public PagedResponse<ProductResponseDto> getProductsPaged(Long categoryId, Long firmId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Product> productPage;
        if (categoryId != null && firmId != null) {
            productPage = productRepository.findByCategoryIdAndFirmIdAndActiveTrue(categoryId, firmId, pageable);
        } else if (categoryId != null) {
            productPage = productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        } else if (firmId != null) {
            productPage = productRepository.findByFirmIdAndActiveTrue(firmId, pageable);
        } else {
            productPage = productRepository.findByActiveTrue(pageable);
        }

        List<ProductResponseDto> content = productPage.getContent()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isLast()
        );
    }

    @Override
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToDto(product);
    }

    @Override
    public ProductResponseDto getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
        return mapToDto(product);
    }

    public ProductResponseDto mapToDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setTechnicalFormula(product.getTechnicalFormula());
        dto.setDosageInstructions(product.getDosageInstructions());
        dto.setUnitOfMeasure(product.getUnitOfMeasure());
        dto.setBasePrice(product.getBasePrice());
        dto.setHsnCode(product.getHsnCode());
        dto.setGstRate(product.getGstRate());
        dto.setImageUrl(product.getImageUrl());
        dto.setFeatured(product.isFeatured());
        dto.setActive(product.isActive());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
            dto.setCategoryCode(product.getCategory().getCode());
        }

        if (product.getBrand() != null) {
            dto.setBrandId(product.getBrand().getId());
            dto.setBrandName(product.getBrand().getName());
            dto.setBrandCode(product.getBrand().getCode());
        }

        if (product.getFirm() != null) {
            dto.setFirmId(product.getFirm().getId());
            dto.setFirmCode(product.getFirm().getCode());
            dto.setFirmName(product.getFirm().getName());
        }

        return dto;
    }
}

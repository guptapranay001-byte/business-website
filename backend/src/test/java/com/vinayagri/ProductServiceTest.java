package com.vinayagri;

import com.vinayagri.dto.PagedResponse;
import com.vinayagri.dto.ProductResponseDto;
import com.vinayagri.entity.Brand;
import com.vinayagri.entity.Category;
import com.vinayagri.entity.Firm;
import com.vinayagri.entity.Product;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.ProductRepository;
import com.vinayagri.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    private ProductServiceImpl productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        productService = new ProductServiceImpl(productRepository);

        Category category = new Category(1L, "Seeds", "seeds", "Hybrid seeds", null, true);
        Firm firm = new Firm();
        firm.setId(10L);
        firm.setCode("VAI");
        firm.setName("Vinay Agri Inputs");
        firm.setActive(true);

        Brand brand = new Brand(5L, "Bayer", "BAYER", "Germany", null, "CropScience", true);

        sampleProduct = new Product(
                100L,
                "SKU-TEST-100",
                "Hybrid Seed 100",
                "High quality seed",
                "Formula A",
                "2 kg / acre",
                "KG",
                new BigDecimal("500.00"),
                "120991",
                new BigDecimal("5.00"),
                "/images/seed.jpg",
                true,
                true,
                category,
                brand,
                firm
        );
    }

    @Test
    void shouldReturnAllActiveProductsWhenNoFilters() {
        when(productRepository.findByActiveTrue()).thenReturn(List.of(sampleProduct));

        List<ProductResponseDto> result = productService.getAllProducts(null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("SKU-TEST-100", result.get(0).getSku());
        assertEquals("Seeds", result.get(0).getCategoryName());
        assertEquals("Vinay Agri Inputs", result.get(0).getFirmName());
        verify(productRepository, times(1)).findByActiveTrue();
    }

    @Test
    void shouldFilterProductsByCategoryId() {
        when(productRepository.findByCategoryIdAndActiveTrue(1L)).thenReturn(List.of(sampleProduct));

        List<ProductResponseDto> result = productService.getAllProducts(1L, null);

        assertEquals(1, result.size());
        verify(productRepository, times(1)).findByCategoryIdAndActiveTrue(1L);
    }

    @Test
    void shouldFilterProductsByFirmId() {
        when(productRepository.findByFirmIdAndActiveTrue(10L)).thenReturn(List.of(sampleProduct));

        List<ProductResponseDto> result = productService.getAllProducts(null, 10L);

        assertEquals(1, result.size());
        verify(productRepository, times(1)).findByFirmIdAndActiveTrue(10L);
    }

    @Test
    void shouldFilterProductsByBothCategoryIdAndFirmId() {
        when(productRepository.findByCategoryIdAndFirmIdAndActiveTrue(1L, 10L)).thenReturn(List.of(sampleProduct));

        List<ProductResponseDto> result = productService.getAllProducts(1L, 10L);

        assertEquals(1, result.size());
        verify(productRepository, times(1)).findByCategoryIdAndFirmIdAndActiveTrue(1L, 10L);
    }

    @Test
    void shouldReturnPagedProducts() {
        PageImpl<Product> page = new PageImpl<>(List.of(sampleProduct), PageRequest.of(0, 10), 1);
        when(productRepository.findByActiveTrue(any(Pageable.class))).thenReturn(page);

        PagedResponse<ProductResponseDto> response = productService.getProductsPaged(null, null, 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(0, response.getPage());
        assertEquals(10, response.getSize());
        assertEquals(1L, response.getTotalElements());
        assertEquals(1, response.getTotalPages());
    }

    @Test
    void shouldReturnProductById() {
        when(productRepository.findById(100L)).thenReturn(Optional.of(sampleProduct));

        ProductResponseDto dto = productService.getProductById(100L);

        assertNotNull(dto);
        assertEquals(100L, dto.getId());
        assertEquals("SKU-TEST-100", dto.getSku());
        verify(productRepository, times(1)).findById(100L);
    }

    @Test
    void shouldThrowExceptionWhenProductNotFoundById() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(999L));
        verify(productRepository, times(1)).findById(999L);
    }

    @Test
    void shouldReturnProductBySku() {
        when(productRepository.findBySku("SKU-TEST-100")).thenReturn(Optional.of(sampleProduct));

        ProductResponseDto dto = productService.getProductBySku("SKU-TEST-100");

        assertNotNull(dto);
        assertEquals("SKU-TEST-100", dto.getSku());
        verify(productRepository, times(1)).findBySku("SKU-TEST-100");
    }

    @Test
    void shouldThrowExceptionWhenProductNotFoundBySku() {
        when(productRepository.findBySku("UNKNOWN")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductBySku("UNKNOWN"));
        verify(productRepository, times(1)).findBySku("UNKNOWN");
    }
}

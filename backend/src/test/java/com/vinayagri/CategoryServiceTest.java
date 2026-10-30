package com.vinayagri;

import com.vinayagri.dto.CategoryResponseDto;
import com.vinayagri.entity.Category;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.CategoryRepository;
import com.vinayagri.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp() {
        categoryService = new CategoryServiceImpl(categoryRepository);
    }

    @Test
    void shouldReturnActiveCategories() {
        Category cat = new Category(1L, "Seeds", "seeds", "Certified seeds", null, true);
        when(categoryRepository.findByActiveTrue()).thenReturn(List.of(cat));

        List<CategoryResponseDto> result = categoryService.getAllActiveCategories();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("seeds", result.get(0).getCode());
        assertEquals("Seeds", result.get(0).getName());
        verify(categoryRepository, times(1)).findByActiveTrue();
    }

    @Test
    void shouldReturnCategoryById() {
        Category cat = new Category(1L, "Seeds", "seeds", "Certified seeds", null, true);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat));

        CategoryResponseDto result = categoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("seeds", result.getCode());
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenCategoryNotFoundById() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryById(999L));
        verify(categoryRepository, times(1)).findById(999L);
    }

    @Test
    void shouldReturnCategoryByCode() {
        Category cat = new Category(1L, "Fertilizers", "fertilizers", "Nutrients", null, true);
        when(categoryRepository.findByCode("fertilizers")).thenReturn(Optional.of(cat));

        CategoryResponseDto result = categoryService.getCategoryByCode("fertilizers");

        assertNotNull(result);
        assertEquals("fertilizers", result.getCode());
        verify(categoryRepository, times(1)).findByCode("fertilizers");
    }

    @Test
    void shouldThrowExceptionWhenCategoryNotFoundByCode() {
        when(categoryRepository.findByCode("unknown")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryByCode("unknown"));
        verify(categoryRepository, times(1)).findByCode("unknown");
    }

    @Test
    void shouldInitializeCategoriesWhenEmpty() {
        when(categoryRepository.count()).thenReturn(0L);

        categoryService.initializeDefaultCategoriesIfEmpty();

        verify(categoryRepository, times(1)).saveAll(any());
    }

    @Test
    void shouldNotInitializeCategoriesWhenNotEmpty() {
        when(categoryRepository.count()).thenReturn(9L);

        categoryService.initializeDefaultCategoriesIfEmpty();

        verify(categoryRepository, never()).saveAll(any());
    }
}

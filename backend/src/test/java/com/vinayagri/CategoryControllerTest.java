package com.vinayagri;

import com.vinayagri.entity.Category;
import com.vinayagri.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = categoryRepository.findByCode("seeds")
                .orElseGet(() -> categoryRepository.save(new Category(null, "Seeds", "seeds", "Certified hybrid seeds", null, true)));
    }

    @Test
    void shouldReturnAllActiveCategories() throws Exception {
        mockMvc.perform(get("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", isA(java.util.List.class)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[?(@.code == 'seeds')].name").value(hasItem("Seeds")));
    }

    @Test
    void shouldReturnCategoryById() throws Exception {
        mockMvc.perform(get("/api/categories/" + testCategory.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(testCategory.getId()))
                .andExpect(jsonPath("$.data.code").value("seeds"))
                .andExpect(jsonPath("$.data.name").value("Seeds"));
    }

    @Test
    void shouldReturn404ForNonExistentCategory() throws Exception {
        mockMvc.perform(get("/api/categories/999999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message", containsString("Category not found with id: '999999'")));
    }

    @Test
    void shouldReturnCategoryByCode() throws Exception {
        mockMvc.perform(get("/api/categories/code/seeds")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.code").value("seeds"))
                .andExpect(jsonPath("$.data.name").value("Seeds"));
    }

    @Test
    void shouldDenyUnauthenticatedPostRequest() throws Exception {
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturn404ForUnmappedStaticResourceOrRoute() throws Exception {
        mockMvc.perform(get("/api/categories/nonexistent/subpath")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void shouldReturn400ForTypeMismatch() throws Exception {
        mockMvc.perform(get("/api/categories/invalid-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", containsString("Parameter 'id' must be of type 'Long'")));
    }
}

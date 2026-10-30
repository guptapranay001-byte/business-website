package com.vinayagri;

import com.vinayagri.entity.Brand;
import com.vinayagri.entity.Category;
import com.vinayagri.entity.Firm;
import com.vinayagri.entity.Product;
import com.vinayagri.repository.BrandRepository;
import com.vinayagri.repository.CategoryRepository;
import com.vinayagri.repository.FirmRepository;
import com.vinayagri.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FirmRepository firmRepository;

    @Autowired
    private BrandRepository brandRepository;

    private Product testProduct;
    private Category testCategory;
    private Firm testFirm;

    @BeforeEach
    void setUp() {
        testCategory = categoryRepository.findByCode("seeds")
                .orElseGet(() -> categoryRepository.save(new Category(null, "Seeds", "seeds", "Hybrid Seeds", null, true)));

        testFirm = firmRepository.findByCode("VAI")
                .orElseGet(() -> {
                    Firm f = new Firm();
                    f.setCode("VAI");
                    f.setName("Vinay Agri Inputs");
                    f.setPrimaryPhone("9829012345");
                    f.setEmail("info@vinayagri.com");
                    f.setActive(true);
                    return firmRepository.save(f);
                });

        Brand testBrand = brandRepository.findByCode("BAYER")
                .orElseGet(() -> brandRepository.save(new Brand(null, "Bayer CropScience", "BAYER", "Germany", null, "Agricultural solutions", true)));

        testProduct = productRepository.findBySku("TEST-SKU-001")
                .orElseGet(() -> {
                    Product p = new Product(
                            null,
                            "TEST-SKU-001",
                            "Hybrid Mustard Seed 5222",
                            "High yielding mustard hybrid seed for Tonk region",
                            "Brassica juncea hybrid",
                            "1 kg per acre",
                            "KG",
                            new BigDecimal("850.00"),
                            "120991",
                            new BigDecimal("5.00"),
                            "/images/mustard-5222.jpg",
                            true,
                            true,
                            testCategory,
                            testBrand,
                            testFirm
                    );
                    return productRepository.save(p);
                });
    }

    @Test
    void shouldReturnAllProducts() throws Exception {
        mockMvc.perform(get("/api/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", isA(java.util.List.class)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[?(@.sku == 'TEST-SKU-001')].name").value(hasItem("Hybrid Mustard Seed 5222")));
    }

    @Test
    void shouldReturnPagedProducts() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content", isA(java.util.List.class)))
                .andExpect(jsonPath("$.data.page").value(0))
                .andExpect(jsonPath("$.data.size").value(10))
                .andExpect(jsonPath("$.data.totalElements", greaterThanOrEqualTo(1)));
    }

    @Test
    void shouldReturnProductsFilteredByCategory() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("categoryId", String.valueOf(testCategory.getId()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", isA(java.util.List.class)))
                .andExpect(jsonPath("$.data[?(@.sku == 'TEST-SKU-001')].categoryName").value(hasItem("Seeds")));
    }

    @Test
    void shouldReturnProductByIdWithCategoryAndFirmDetails() throws Exception {
        mockMvc.perform(get("/api/products/" + testProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(testProduct.getId()))
                .andExpect(jsonPath("$.data.sku").value("TEST-SKU-001"))
                .andExpect(jsonPath("$.data.name").value("Hybrid Mustard Seed 5222"))
                .andExpect(jsonPath("$.data.categoryId").value(testCategory.getId()))
                .andExpect(jsonPath("$.data.categoryName").value("Seeds"))
                .andExpect(jsonPath("$.data.firmId").value(testFirm.getId()))
                .andExpect(jsonPath("$.data.firmCode").value("VAI"))
                .andExpect(jsonPath("$.data.firmName").value("Vinay Agri Inputs"))
                .andExpect(jsonPath("$.data.basePrice").value(850.00));
    }

    @Test
    void shouldReturn404ForNonExistentProduct() throws Exception {
        mockMvc.perform(get("/api/products/999999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message", containsString("Product not found with id: '999999'")));
    }

    @Test
    void shouldReturnProductBySku() throws Exception {
        mockMvc.perform(get("/api/products/sku/TEST-SKU-001")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.sku").value("TEST-SKU-001"))
                .andExpect(jsonPath("$.data.name").value("Hybrid Mustard Seed 5222"));
    }

    @Test
    void shouldDenyUnauthenticatedPostRequest() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sku\":\"NEW-SKU\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturn400ForInvalidProductIdType() throws Exception {
        mockMvc.perform(get("/api/products/invalid-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", containsString("Parameter 'id' must be of type 'Long'")));
    }
}

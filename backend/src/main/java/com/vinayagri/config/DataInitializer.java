package com.vinayagri.config;

import com.vinayagri.service.CategoryService;
import com.vinayagri.service.FirmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final FirmService firmService;
    private final CategoryService categoryService;

    public DataInitializer(FirmService firmService, CategoryService categoryService) {
        this.firmService = firmService;
        this.categoryService = categoryService;
    }

    @Override
    public void run(String... args) {
        log.info("Verifying initial business data setup...");
        firmService.initializeDefaultFirmsIfEmpty();
        categoryService.initializeDefaultCategoriesIfEmpty();
    }
}

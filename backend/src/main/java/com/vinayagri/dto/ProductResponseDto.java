package com.vinayagri.dto;

import java.math.BigDecimal;

public class ProductResponseDto {

    private Long id;
    private String sku;
    private String name;
    private String description;
    private String technicalFormula;
    private String dosageInstructions;
    private String unitOfMeasure;
    private BigDecimal basePrice;
    private String hsnCode;
    private BigDecimal gstRate;
    private String imageUrl;
    private boolean featured;
    private boolean active;

    // Category summary
    private Long categoryId;
    private String categoryName;
    private String categoryCode;

    // Brand summary
    private Long brandId;
    private String brandName;
    private String brandCode;

    // Firm summary
    private Long firmId;
    private String firmCode;
    private String firmName;

    public ProductResponseDto() {
    }

    public ProductResponseDto(Long id, String sku, String name, String description,
                              String technicalFormula, String dosageInstructions, String unitOfMeasure,
                              BigDecimal basePrice, String hsnCode, BigDecimal gstRate,
                              String imageUrl, boolean featured, boolean active,
                              Long categoryId, String categoryName, String categoryCode,
                              Long brandId, String brandName, String brandCode,
                              Long firmId, String firmCode, String firmName) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.technicalFormula = technicalFormula;
        this.dosageInstructions = dosageInstructions;
        this.unitOfMeasure = unitOfMeasure;
        this.basePrice = basePrice;
        this.hsnCode = hsnCode;
        this.gstRate = gstRate;
        this.imageUrl = imageUrl;
        this.featured = featured;
        this.active = active;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryCode = categoryCode;
        this.brandId = brandId;
        this.brandName = brandName;
        this.brandCode = brandCode;
        this.firmId = firmId;
        this.firmCode = firmCode;
        this.firmName = firmName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechnicalFormula() {
        return technicalFormula;
    }

    public void setTechnicalFormula(String technicalFormula) {
        this.technicalFormula = technicalFormula;
    }

    public String getDosageInstructions() {
        return dosageInstructions;
    }

    public void setDosageInstructions(String dosageInstructions) {
        this.dosageInstructions = dosageInstructions;
    }

    public String getUnitOfMeasure() {
        return unitOfMeasure;
    }

    public void setUnitOfMeasure(String unitOfMeasure) {
        this.unitOfMeasure = unitOfMeasure;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getHsnCode() {
        return hsnCode;
    }

    public void setHsnCode(String hsnCode) {
        this.hsnCode = hsnCode;
    }

    public BigDecimal getGstRate() {
        return gstRate;
    }

    public void setGstRate(BigDecimal gstRate) {
        this.gstRate = gstRate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getBrandCode() {
        return brandCode;
    }

    public void setBrandCode(String brandCode) {
        this.brandCode = brandCode;
    }

    public Long getFirmId() {
        return firmId;
    }

    public void setFirmId(Long firmId) {
        this.firmId = firmId;
    }

    public String getFirmCode() {
        return firmCode;
    }

    public void setFirmCode(String firmCode) {
        this.firmCode = firmCode;
    }

    public String getFirmName() {
        return firmName;
    }

    public void setFirmName(String firmName) {
        this.firmName = firmName;
    }
}

package com.vinayagri.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "technical_formula", length = 255)
    private String technicalFormula;

    @Column(name = "dosage_instructions", columnDefinition = "TEXT")
    private String dosageInstructions;

    @Column(name = "unit_of_measure", length = 30)
    private String unitOfMeasure; // e.g. "KG", "LITRE", "PACKET", "PIECE"

    @NotNull
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "hsn_code", length = 20)
    private String hsnCode;

    @Column(name = "gst_rate", precision = 5, scale = 2)
    private BigDecimal gstRate;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_featured")
    private boolean featured = false;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firm_id")
    private Firm firm;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Product() {
    }

    public Product(Long id, String sku, String name, String description, String technicalFormula,
                   String dosageInstructions, String unitOfMeasure, BigDecimal basePrice,
                   String hsnCode, BigDecimal gstRate, String imageUrl, boolean featured,
                   boolean active, Category category, Brand brand, Firm firm) {
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
        this.category = category;
        this.brand = brand;
        this.firm = firm;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public Firm getFirm() {
        return firm;
    }

    public void setFirm(Firm firm) {
        this.firm = firm;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

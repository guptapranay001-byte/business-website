package com.vinayagri.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity maintaining firm-specific inventory records for products.
 * Allows consolidated multi-firm reporting while preserving isolated inventory per firm.
 */
@Entity
@Table(name = "inventories",
       uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "firm_id", "batch_number"}))
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firm_id", nullable = false)
    private Firm firm;

    @Column(name = "batch_number", length = 50)
    private String batchNumber = "DEFAULT";

    @NotNull
    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable = 0;

    @Column(name = "reorder_level")
    private Integer reorderLevel = 10;

    @Column(name = "unit_cost", precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "selling_price", precision = 10, scale = 2)
    private BigDecimal sellingPrice;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "last_stock_update")
    private LocalDateTime lastStockUpdate;

    public Inventory() {
    }

    public Inventory(Long id, Product product, Firm firm, String batchNumber,
                     Integer quantityAvailable, Integer reorderLevel, BigDecimal unitCost,
                     BigDecimal sellingPrice, LocalDate expiryDate) {
        this.id = id;
        this.product = product;
        this.firm = firm;
        this.batchNumber = batchNumber;
        this.quantityAvailable = quantityAvailable;
        this.reorderLevel = reorderLevel;
        this.unitCost = unitCost;
        this.sellingPrice = sellingPrice;
        this.expiryDate = expiryDate;
        this.lastStockUpdate = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastStockUpdate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Firm getFirm() {
        return firm;
    }

    public void setFirm(Firm firm) {
        this.firm = firm;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public LocalDateTime getLastStockUpdate() {
        return lastStockUpdate;
    }

    public void setLastStockUpdate(LocalDateTime lastStockUpdate) {
        this.lastStockUpdate = lastStockUpdate;
    }
}

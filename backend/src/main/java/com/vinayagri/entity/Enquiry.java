package com.vinayagri.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "enquiries")
public class Enquiry {

    public enum EnquiryType {
        GENERAL,
        PRODUCT,
        BULK_QUOTATION
    }

    public enum EnquiryStatus {
        NEW,
        IN_PROGRESS,
        RESOLVED,
        CLOSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "enquiry_type", nullable = false, length = 30)
    private EnquiryType enquiryType = EnquiryType.GENERAL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firm_id")
    private Firm targetFirm;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @NotBlank
    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @NotBlank
    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "customer_email", length = 120)
    private String customerEmail;

    @Column(length = 100)
    private String city;

    @Column(name = "quantity_required", length = 100)
    private String quantityRequired;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EnquiryStatus status = EnquiryStatus.NEW;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Enquiry() {
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

    public EnquiryType getEnquiryType() {
        return enquiryType;
    }

    public void setEnquiryType(EnquiryType enquiryType) {
        this.enquiryType = enquiryType;
    }

    public Firm getTargetFirm() {
        return targetFirm;
    }

    public void setTargetFirm(Firm targetFirm) {
        this.targetFirm = targetFirm;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getQuantityRequired() {
        return quantityRequired;
    }

    public void setQuantityRequired(String quantityRequired) {
        this.quantityRequired = quantityRequired;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public EnquiryStatus getStatus() {
        return status;
    }

    public void setStatus(EnquiryStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

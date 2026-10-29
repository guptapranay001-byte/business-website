package com.vinayagri.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * Entity representing one of the four business firms operated in Tonk, Rajasthan:
 * 1. Vinay Agri Inputs
 * 2. Gupta Traders and Auto Agencies
 * 3. Vinay Khad Beej Bhandaar
 * 4. Gupta Traders, Tonk
 */
@Entity
@Table(name = "firms")
public class Firm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(length = 20)
    private String gstin;

    @Column(name = "primary_phone", length = 20)
    private String primaryPhone;

    @Column(name = "secondary_phone", length = 20)
    private String secondaryPhone;

    @Column(length = 100)
    private String email;

    @Column(name = "address_line1", length = 255)
    private String addressLine1;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 20)
    private String pincode;

    @Column(name = "agency_type", length = 100)
    private String agencyType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Firm() {
    }

    public Firm(Long id, String code, String name, String registrationNumber, String gstin,
                String primaryPhone, String secondaryPhone, String email, String addressLine1,
                String city, String state, String pincode, String agencyType, String description,
                boolean active) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.registrationNumber = registrationNumber;
        this.gstin = gstin;
        this.primaryPhone = primaryPhone;
        this.secondaryPhone = secondaryPhone;
        this.email = email;
        this.addressLine1 = addressLine1;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.agencyType = agencyType;
        this.description = description;
        this.active = active;
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

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public String getPrimaryPhone() {
        return primaryPhone;
    }

    public void setPrimaryPhone(String primaryPhone) {
        this.primaryPhone = primaryPhone;
    }

    public String getSecondaryPhone() {
        return secondaryPhone;
    }

    public void setSecondaryPhone(String secondaryPhone) {
        this.secondaryPhone = secondaryPhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getAgencyType() {
        return agencyType;
    }

    public void setAgencyType(String agencyType) {
        this.agencyType = agencyType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

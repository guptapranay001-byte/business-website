package com.vinayagri.dto;

public class CategoryResponseDto {

    private Long id;
    private String name;
    private String code;
    private String description;
    private String imageUrl;
    private boolean active;

    public CategoryResponseDto() {
    }

    public CategoryResponseDto(Long id, String name, String code, String description, String imageUrl, boolean active) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.imageUrl = imageUrl;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

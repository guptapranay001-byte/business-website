package com.vinayagri.dto;

import java.time.LocalDateTime;
import java.util.List;

public class HealthStatusDto {

    private String status;
    private String application;
    private String version;
    private String location;
    private List<String> managedFirms;
    private LocalDateTime timestamp;

    public HealthStatusDto() {
        this.timestamp = LocalDateTime.now();
    }

    public HealthStatusDto(String status, String application, String version, String location, List<String> managedFirms) {
        this.status = status;
        this.application = application;
        this.version = version;
        this.location = location;
        this.managedFirms = managedFirms;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getManagedFirms() {
        return managedFirms;
    }

    public void setManagedFirms(List<String> managedFirms) {
        this.managedFirms = managedFirms;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

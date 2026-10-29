package com.vinayagri.service.impl;

import com.vinayagri.dto.FirmResponseDto;
import com.vinayagri.entity.Firm;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.FirmRepository;
import com.vinayagri.service.FirmService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FirmServiceImpl implements FirmService {

    private static final Logger log = LoggerFactory.getLogger(FirmServiceImpl.class);
    private final FirmRepository firmRepository;

    // Constructor-based dependency injection
    public FirmServiceImpl(FirmRepository firmRepository) {
        this.firmRepository = firmRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FirmResponseDto> getAllActiveFirms() {
        return firmRepository.findByActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FirmResponseDto getFirmByCode(String code) {
        Firm firm = firmRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Firm", "code", code));
        return mapToDto(firm);
    }

    @Override
    @Transactional(readOnly = true)
    public FirmResponseDto getFirmById(Long id) {
        Firm firm = firmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Firm", "id", id));
        return mapToDto(firm);
    }

    @Override
    public void initializeDefaultFirmsIfEmpty() {
        if (firmRepository.count() == 0) {
            log.info("Initializing baseline records for the four family enterprise firms in Tonk, Rajasthan...");

            Firm vai = new Firm(
                    null,
                    "VAI",
                    "Vinay Agri Inputs",
                    "RJ-TNK-VAI-2026",
                    "08AAAAA0000A1Z5",
                    "01432-240001",
                    "9829000001",
                    "contact@vinayagri.in",
                    "Station Road, Near Krishi Upaj Mandi",
                    "Tonk",
                    "Rajasthan",
                    "304001",
                    "Crop Nutrition, Pesticides & Agricultural Equipment",
                    "Flagship agricultural distribution hub specializing in modern crop inputs, bio-fertilizers, and plant protection products.",
                    true
            );

            Firm gtaa = new Firm(
                    null,
                    "GTAA",
                    "Gupta Traders and Auto Agencies",
                    "RJ-TNK-GTAA-2026",
                    "08AAAAA0000A2Z4",
                    "01432-240002",
                    "9829000002",
                    "gtaa.tonk@vinayagri.in",
                    "Old Bus Stand Road",
                    "Tonk",
                    "Rajasthan",
                    "304001",
                    "Tractor Parts, Auto Agencies, Diesel Engine Spares & Farm Implements",
                    "Specialized dealership and distribution agency for tractor spares, farm implements, and automotive inputs.",
                    true
            );

            Firm vkbb = new Firm(
                    null,
                    "VKBB",
                    "Vinay Khad Beej Bhandaar",
                    "RJ-TNK-VKBB-2026",
                    "08AAAAA0000A3Z3",
                    "01432-240003",
                    "9829000003",
                    "vkbb.tonk@vinayagri.in",
                    "Subhash Chowk, Grain Market",
                    "Tonk",
                    "Rajasthan",
                    "304001",
                    "Certified Seeds, Chemical Fertilizers & Soil Nutrients",
                    "Longstanding retail and wholesale distributor for certified crop seeds, government-approved fertilizers, and micro-nutrients.",
                    true
            );

            Firm gtt = new Firm(
                    null,
                    "GTT",
                    "Gupta Traders, Tonk",
                    "RJ-TNK-GTT-2026",
                    "08AAAAA0000A4Z2",
                    "01432-240004",
                    "9829000004",
                    "guptatraders.tonk@vinayagri.in",
                    "Mandi Samiti Complex",
                    "Tonk",
                    "Rajasthan",
                    "304001",
                    "Agricultural Commodities, Bulk Trading & Institutional Supplies",
                    "Commercial trade and distribution firm dealing in institutional agricultural supplies and bulk distribution across Rajasthan.",
                    true
            );

            firmRepository.saveAll(List.of(vai, gtaa, vkbb, gtt));
            log.info("Baseline firms initialized successfully.");
        }
    }

    private FirmResponseDto mapToDto(Firm firm) {
        FirmResponseDto dto = new FirmResponseDto();
        dto.setId(firm.getId());
        dto.setCode(firm.getCode());
        dto.setName(firm.getName());
        dto.setRegistrationNumber(firm.getRegistrationNumber());
        dto.setGstin(firm.getGstin());
        dto.setPrimaryPhone(firm.getPrimaryPhone());
        dto.setSecondaryPhone(firm.getSecondaryPhone());
        dto.setEmail(firm.getEmail());
        dto.setAddressLine1(firm.getAddressLine1());
        dto.setCity(firm.getCity());
        dto.setState(firm.getState());
        dto.setPincode(firm.getPincode());
        dto.setAgencyType(firm.getAgencyType());
        dto.setDescription(firm.getDescription());
        dto.setActive(firm.isActive());
        return dto;
    }
}

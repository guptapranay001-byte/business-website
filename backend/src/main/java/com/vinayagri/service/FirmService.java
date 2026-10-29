package com.vinayagri.service;

import com.vinayagri.dto.FirmResponseDto;
import java.util.List;

public interface FirmService {
    List<FirmResponseDto> getAllActiveFirms();
    FirmResponseDto getFirmByCode(String code);
    FirmResponseDto getFirmById(Long id);
    void initializeDefaultFirmsIfEmpty();
}

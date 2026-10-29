package com.vinayagri;

import com.vinayagri.dto.FirmResponseDto;
import com.vinayagri.entity.Firm;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.FirmRepository;
import com.vinayagri.service.impl.FirmServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FirmServiceTest {

    @Mock
    private FirmRepository firmRepository;

    private FirmServiceImpl firmService;

    @BeforeEach
    void setUp() {
        firmService = new FirmServiceImpl(firmRepository);
    }

    @Test
    void shouldReturnActiveFirms() {
        Firm firm1 = new Firm();
        firm1.setId(1L);
        firm1.setCode("VAI");
        firm1.setName("Vinay Agri Inputs");
        firm1.setActive(true);

        when(firmRepository.findByActiveTrue()).thenReturn(List.of(firm1));

        List<FirmResponseDto> result = firmService.getAllActiveFirms();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("VAI", result.get(0).getCode());
        assertEquals("Vinay Agri Inputs", result.get(0).getName());
        verify(firmRepository, times(1)).findByActiveTrue();
    }

    @Test
    void shouldThrowExceptionWhenFirmNotFound() {
        when(firmRepository.findByCode("NON_EXISTENT")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> firmService.getFirmByCode("NON_EXISTENT"));
        verify(firmRepository, times(1)).findByCode("NON_EXISTENT");
    }
}

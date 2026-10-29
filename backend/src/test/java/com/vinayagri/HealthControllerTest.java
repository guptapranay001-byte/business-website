package com.vinayagri;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnHealthyStatusAndFirmsList() throws Exception {
        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.location").value("Tonk, Rajasthan, India"))
                .andExpect(jsonPath("$.data.managedFirms[0]").value("Vinay Agri Inputs"))
                .andExpect(jsonPath("$.data.managedFirms[1]").value("Gupta Traders and Auto Agencies"))
                .andExpect(jsonPath("$.data.managedFirms[2]").value("Vinay Khad Beej Bhandaar"))
                .andExpect(jsonPath("$.data.managedFirms[3]").value("Gupta Traders, Tonk"));
    }
}

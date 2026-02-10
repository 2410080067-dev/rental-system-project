package com.rental.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Booking DTO for API requests and responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("vehicleId")
    private Long vehicleId;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalAmount;
    private String status;
    
    // Additional fields for response
    private String userName;
    private String vehicleName;
}

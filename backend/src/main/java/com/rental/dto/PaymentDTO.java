package com.rental.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Payment DTO for API requests and responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    
    @JsonProperty("bookingId")
    private Long bookingId;
    
    private Double amount;
    private String status;
    private LocalDateTime paymentDate;
}

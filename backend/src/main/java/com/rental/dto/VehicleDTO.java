package com.rental.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Vehicle DTO for API requests and responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;
    private String name;
    private String category;
    private Double pricePerDay;
    private Boolean available;
    private String imageUrl;
}

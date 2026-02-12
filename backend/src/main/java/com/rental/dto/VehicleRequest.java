package com.rental.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {
    @NotBlank(message = "Vehicle name is required")
    private String name;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @Positive(message = "Price must be positive")
    private Double pricePerDay;

    private Boolean available;
    private String imageUrl;
}

package com.rental.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;
    private String name;
    private String description;
    private String type;
    private String category;
    private Double pricePerDay;
    private Boolean available;
    private String imageUrl;
    private Double averageRating;
    private Integer totalReviews;
}

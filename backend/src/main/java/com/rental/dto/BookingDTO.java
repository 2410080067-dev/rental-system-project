package com.rental.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("vehicleId")
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Double totalAmount;
    private String status;
    private String userName;
    private String vehicleName;
    private String vehicleImageUrl;
    private String vehicleCategory;
    private Double vehiclePricePerDay;
    private String createdAt;
}

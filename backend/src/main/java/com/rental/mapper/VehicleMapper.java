package com.rental.mapper;

import com.rental.dto.VehicleDTO;
import com.rental.dto.VehicleRequest;
import com.rental.model.Vehicle;
import com.rental.model.VehicleType;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public VehicleDTO toDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(vehicle.getId());
        dto.setName(vehicle.getName());
        dto.setDescription(vehicle.getDescription());
        dto.setType(vehicle.getType() != null ? vehicle.getType().name() : null);
        dto.setCategory(vehicle.getCategory());
        dto.setPricePerDay(vehicle.getPricePerDay());
        dto.setAvailable(vehicle.isAvailable());
        dto.setImageUrl(vehicle.getImageUrl());
        dto.setAverageRating(vehicle.getAverageRating());
        dto.setTotalReviews(vehicle.getTotalReviews());
        return dto;
    }

    public Vehicle toEntity(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setName(request.getName());
        vehicle.setDescription(request.getDescription());
        vehicle.setCategory(request.getCategory());
        vehicle.setPricePerDay(request.getPricePerDay());
        vehicle.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        vehicle.setImageUrl(request.getImageUrl());

        // Set type from category
        try {
            vehicle.setType(VehicleType.valueOf(request.getCategory().toUpperCase()));
        } catch (Exception e) {
            vehicle.setType(VehicleType.CAR);
        }
        return vehicle;
    }

    public void updateEntity(Vehicle vehicle, VehicleRequest request) {
        if (request.getName() != null) vehicle.setName(request.getName());
        if (request.getDescription() != null) vehicle.setDescription(request.getDescription());
        if (request.getCategory() != null) {
            vehicle.setCategory(request.getCategory());
            try {
                vehicle.setType(VehicleType.valueOf(request.getCategory().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (request.getPricePerDay() != null) vehicle.setPricePerDay(request.getPricePerDay());
        if (request.getAvailable() != null) vehicle.setAvailable(request.getAvailable());
        if (request.getImageUrl() != null) vehicle.setImageUrl(request.getImageUrl());
    }
}

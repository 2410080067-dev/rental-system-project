package com.rental.service;

import com.rental.dto.VehicleDTO;
import com.rental.dto.VehicleRequest;
import com.rental.exception.ResourceNotFoundException;
import com.rental.mapper.VehicleMapper;
import com.rental.model.Vehicle;
import com.rental.repository.ReviewRepository;
import com.rental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ReviewRepository reviewRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleService(VehicleRepository vehicleRepository, ReviewRepository reviewRepository,
                          VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.reviewRepository = reviewRepository;
        this.vehicleMapper = vehicleMapper;
    }

    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::enrichWithRating)
                .map(vehicleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public VehicleDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        enrichWithRating(vehicle);
        return vehicleMapper.toDTO(vehicle);
    }

    public List<VehicleDTO> getAvailableVehicles() {
        return vehicleRepository.findByAvailableTrue().stream()
                .map(this::enrichWithRating)
                .map(vehicleMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<VehicleDTO> getVehiclesByCategory(String category) {
        return vehicleRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::enrichWithRating)
                .map(vehicleMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<VehicleDTO> searchVehicles(String name) {
        return vehicleRepository.searchByKeyword(name).stream()
                .map(this::enrichWithRating)
                .map(vehicleMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<VehicleDTO> getVehiclesByPriceRange(double min, double max) {
        return vehicleRepository.findByPricePerDayBetween(min, max).stream()
                .map(this::enrichWithRating)
                .map(vehicleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public VehicleDTO createVehicle(VehicleRequest request) {
        Vehicle vehicle = vehicleMapper.toEntity(request);
        Vehicle saved = vehicleRepository.save(vehicle);
        return vehicleMapper.toDTO(saved);
    }

    @SuppressWarnings("null")
    public VehicleDTO updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        vehicleMapper.updateEntity(vehicle, request);
        Vehicle updated = vehicleRepository.save(vehicle);
        enrichWithRating(updated);
        return vehicleMapper.toDTO(updated);
    }

    @SuppressWarnings("null")
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    @SuppressWarnings("null")
    public VehicleDTO toggleAvailability(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        vehicle.setAvailable(!vehicle.isAvailable());
        Vehicle updated = vehicleRepository.save(vehicle);
        enrichWithRating(updated);
        return vehicleMapper.toDTO(updated);
    }

    public long getVehicleCount() {
        return vehicleRepository.count();
    }

    public long getAvailableCount() {
        return vehicleRepository.countByAvailableTrue();
    }

    private Vehicle enrichWithRating(Vehicle vehicle) {
        vehicle.setAverageRating(reviewRepository.getAverageRatingByVehicleId(vehicle.getId()));
        vehicle.setTotalReviews(reviewRepository.getReviewCountByVehicleId(vehicle.getId()));
        return vehicle;
    }
}

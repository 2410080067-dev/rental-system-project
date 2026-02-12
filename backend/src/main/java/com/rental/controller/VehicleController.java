package com.rental.controller;

import com.rental.dto.VehicleDTO;
import com.rental.dto.VehicleRequest;
import com.rental.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicles")
@Tag(name = "Vehicles", description = "Vehicle management endpoints")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(summary = "Get all vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by ID")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available vehicles")
    public ResponseEntity<List<VehicleDTO>> getAvailableVehicles() {
        return ResponseEntity.ok(vehicleService.getAvailableVehicles());
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get vehicles by category")
    public ResponseEntity<List<VehicleDTO>> getVehiclesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(vehicleService.getVehiclesByCategory(category));
    }

    @GetMapping("/search")
    @Operation(summary = "Search vehicles by name")
    public ResponseEntity<List<VehicleDTO>> searchVehicles(@RequestParam String name) {
        return ResponseEntity.ok(vehicleService.searchVehicles(name));
    }

    @GetMapping("/price-range")
    @Operation(summary = "Get vehicles by price range")
    public ResponseEntity<List<VehicleDTO>> getVehiclesByPriceRange(
            @RequestParam double min, @RequestParam double max) {
        return ResponseEntity.ok(vehicleService.getVehiclesByPriceRange(min, max));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a new vehicle (Admin only)")
    public ResponseEntity<VehicleDTO> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.createVehicle(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update vehicle (Admin only)")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long id,
                                                     @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    @PutMapping("/{id}/toggle-availability")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle vehicle availability (Admin only)")
    public ResponseEntity<VehicleDTO> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.toggleAvailability(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete vehicle (Admin only)")
    public ResponseEntity<Map<String, Object>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Vehicle deleted successfully"));
    }
}

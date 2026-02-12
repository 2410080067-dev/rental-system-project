package com.rental.controller;

import com.rental.dto.ReviewDTO;
import com.rental.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@Tag(name = "Reviews", description = "Review and rating endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Submit a review for a vehicle")
    public ResponseEntity<ReviewDTO> createReview(
            @RequestParam Long userId,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(userId, reviewDTO));
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get all reviews for a vehicle")
    public ResponseEntity<List<ReviewDTO>> getVehicleReviews(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsByVehicleId(vehicleId));
    }

    @GetMapping("/user/{userId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all reviews by a user")
    public ResponseEntity<List<ReviewDTO>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUserId(userId));
    }

    @GetMapping("/vehicle/{vehicleId}/rating")
    @Operation(summary = "Get average rating for a vehicle")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long vehicleId) {
        Double avg = reviewService.getAverageRating(vehicleId);
        return ResponseEntity.ok(Map.of(
                "vehicleId", vehicleId,
                "averageRating", avg != null ? avg : 0.0
        ));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a review")
    public ResponseEntity<Map<String, Object>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Review deleted successfully"));
    }
}

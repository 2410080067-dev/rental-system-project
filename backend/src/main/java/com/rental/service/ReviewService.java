package com.rental.service;

import com.rental.dto.ReviewDTO;
import com.rental.exception.BadRequestException;
import com.rental.exception.ResourceNotFoundException;
import com.rental.mapper.ReviewMapper;
import com.rental.model.Review;
import com.rental.model.User;
import com.rental.model.Vehicle;
import com.rental.repository.ReviewRepository;
import com.rental.repository.UserRepository;
import com.rental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         VehicleRepository vehicleRepository, ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.reviewMapper = reviewMapper;
    }

    @SuppressWarnings("null")
    public ReviewDTO createReview(Long userId, ReviewDTO reviewDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(reviewDTO.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (reviewRepository.existsByUserIdAndVehicleId(userId, reviewDTO.getVehicleId())) {
            throw new BadRequestException("You have already reviewed this vehicle");
        }

        Review review = new Review();
        review.setUser(user);
        review.setVehicle(vehicle);
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        Review saved = reviewRepository.save(review);
        return reviewMapper.toDTO(saved);
    }

    public List<ReviewDTO> getReviewsByVehicleId(Long vehicleId) {
        return reviewRepository.findByVehicleIdOrderByCreatedAtDesc(vehicleId).stream()
                .map(reviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(reviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long vehicleId) {
        return reviewRepository.getAverageRatingByVehicleId(vehicleId);
    }

    @SuppressWarnings("null")
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found");
        }
        reviewRepository.deleteById(id);
    }
}

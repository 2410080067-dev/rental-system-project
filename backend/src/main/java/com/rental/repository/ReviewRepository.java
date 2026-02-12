package com.rental.repository;

import com.rental.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVehicleIdOrderByCreatedAtDesc(Long vehicleId);
    List<Review> findByUserId(Long userId);
    boolean existsByUserIdAndVehicleId(Long userId, Long vehicleId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.vehicle.id = :vehicleId")
    Double getAverageRatingByVehicleId(@Param("vehicleId") Long vehicleId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.vehicle.id = :vehicleId")
    Integer getReviewCountByVehicleId(@Param("vehicleId") Long vehicleId);
}

package com.rental.repository;

import com.rental.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByAvailableTrue();
    List<Vehicle> findByCategoryIgnoreCase(String category);
    List<Vehicle> findByNameContainingIgnoreCase(String name);
    List<Vehicle> findByPricePerDayBetween(double min, double max);

    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(v.category) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Vehicle> searchByKeyword(String keyword);

    @Query("SELECT v FROM Vehicle v WHERE v.available = true AND LOWER(v.category) = LOWER(:category)")
    List<Vehicle> findAvailableByCategory(String category);

    long countByAvailableTrue();
}

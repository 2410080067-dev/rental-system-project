package com.rental.repository;

import com.rental.model.Booking;
import com.rental.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByVehicleId(Long vehicleId);
    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId " +
           "AND b.status NOT IN (com.rental.model.BookingStatus.CANCELLED) " +
           "AND ((b.startDate <= :endDate AND b.endDate >= :startDate))")
    List<Booking> findOverlappingBookings(@Param("vehicleId") Long vehicleId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = com.rental.model.BookingStatus.COMPLETED")
    double calculateTotalRevenue();

    @Query("SELECT FUNCTION('MONTHNAME', b.createdAt) as month, " +
           "SUM(b.totalAmount) as revenue, COUNT(b) as bookings " +
           "FROM Booking b WHERE b.status = com.rental.model.BookingStatus.COMPLETED " +
           "AND FUNCTION('YEAR', b.createdAt) = :year " +
           "GROUP BY FUNCTION('MONTH', b.createdAt), FUNCTION('MONTHNAME', b.createdAt) " +
           "ORDER BY FUNCTION('MONTH', b.createdAt)")
    List<Object[]> getMonthlyRevenue(@Param("year") int year);
}

package com.rental.service;

import com.rental.model.Booking;
import com.rental.model.User;
import com.rental.model.Vehicle;
import com.rental.repository.BookingRepository;
import com.rental.repository.UserRepository;
import com.rental.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Booking-related business logic
 */
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Create a new booking
     */
    public Booking createBooking(Long userId, Long vehicleId, LocalDate startDate, LocalDate endDate) {
        // Validate user exists
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        // Validate vehicle exists
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
        if (vehicle.isEmpty()) {
            throw new RuntimeException("Vehicle not found with id: " + vehicleId);
        }

        // Validate dates
        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("Start date must be before end date");
        }

        // Calculate total amount
        long daysCount = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        Double totalAmount = vehicle.get().getPricePerDay() * daysCount;

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user.get());
        booking.setVehicle(vehicle.get());
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setTotalAmount(totalAmount);
        booking.setStatus("Active");

        // Update vehicle availability to not available (booked)
        Vehicle vehicleToUpdate = vehicle.get();
        vehicleToUpdate.setAvailable(false);
        vehicleRepository.save(vehicleToUpdate);

        return bookingRepository.save(booking);
    }

    /**
     * Get all bookings
     */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Get bookings by user ID
     */
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    /**
     * Get booking by ID
     */
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    /**
     * Cancel a booking
     */
    public Booking cancelBooking(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isPresent()) {
            Booking existingBooking = booking.get();
            
            // Check if already completed
            if ("Completed".equals(existingBooking.getStatus())) {
                throw new RuntimeException("Cannot cancel a completed booking");
            }

            // Update booking status
            existingBooking.setStatus("Cancelled");
            bookingRepository.save(existingBooking);

            // Update vehicle availability back to available
            Vehicle vehicle = existingBooking.getVehicle();
            vehicle.setAvailable(true);
            vehicleRepository.save(vehicle);

            return existingBooking;
        }
        throw new RuntimeException("Booking not found with id: " + id);
    }

    /**
     * Complete a booking
     */
    public Booking completeBooking(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isPresent()) {
            Booking existingBooking = booking.get();
            existingBooking.setStatus("Completed");
            bookingRepository.save(existingBooking);

            // Update vehicle availability back to available
            Vehicle vehicle = existingBooking.getVehicle();
            vehicle.setAvailable(true);
            vehicleRepository.save(vehicle);

            return existingBooking;
        }
        throw new RuntimeException("Booking not found with id: " + id);
    }

    /**
     * Get bookings by vehicle ID
     */
    public List<Booking> getBookingsByVehicleId(Long vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }
}

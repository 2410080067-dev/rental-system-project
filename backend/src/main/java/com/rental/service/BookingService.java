package com.rental.service;

import com.rental.dto.BookingDTO;
import com.rental.exception.BadRequestException;
import com.rental.exception.ResourceNotFoundException;
import com.rental.mapper.BookingMapper;
import com.rental.model.*;
import com.rental.repository.BookingRepository;
import com.rental.repository.UserRepository;
import com.rental.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingMapper bookingMapper;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository,
                          VehicleRepository vehicleRepository, BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.bookingMapper = bookingMapper;
    }

    @SuppressWarnings("null")
    @Transactional
    public BookingDTO createBooking(Long userId, Long vehicleId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));

        if (!vehicle.isAvailable()) {
            throw new BadRequestException("Vehicle is not available for booking");
        }

        if (startDate.isAfter(endDate)) {
            throw new BadRequestException("Start date must be before end date");
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Start date cannot be in the past");
        }

        // Check for double booking
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(vehicleId, startDate, endDate);
        if (!overlapping.isEmpty()) {
            throw new BadRequestException("Vehicle is already booked for the selected dates");
        }

        long daysCount = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        double totalAmount = vehicle.getPricePerDay() * daysCount;

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toDTO(saved);
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return bookingMapper.toDTO(booking);
    }

    @SuppressWarnings("null")
    @Transactional
    public BookingDTO approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        // Mark vehicle unavailable
        Vehicle vehicle = booking.getVehicle();
        vehicle.setAvailable(false);
        vehicleRepository.save(vehicle);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    @SuppressWarnings("null")
    @Transactional
    public BookingDTO cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        // Make vehicle available again
        Vehicle vehicle = booking.getVehicle();
        vehicle.setAvailable(true);
        vehicleRepository.save(vehicle);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    @SuppressWarnings("null")
    @Transactional
    public BookingDTO completeBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.COMPLETED);

        // Make vehicle available again
        Vehicle vehicle = booking.getVehicle();
        vehicle.setAvailable(true);
        vehicleRepository.save(vehicle);

        return bookingMapper.toDTO(bookingRepository.save(booking));
    }

    public long getBookingCount() {
        return bookingRepository.count();
    }

    public long getBookingCountByStatus(BookingStatus status) {
        return bookingRepository.countByStatus(status);
    }

    public double getTotalRevenue() {
        return bookingRepository.calculateTotalRevenue();
    }

    public List<Object[]> getMonthlyRevenue(int year) {
        return bookingRepository.getMonthlyRevenue(year);
    }
}

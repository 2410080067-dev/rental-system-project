package com.rental.service;

import com.rental.model.Booking;
import com.rental.model.Payment;
import com.rental.repository.BookingRepository;
import com.rental.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Payment-related business logic
 */
@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    /**
     * Process payment for a booking
     */
    public Payment processPayment(Long bookingId, Double amount) {
        // Validate booking exists
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isEmpty()) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }

        // Check if amount matches booking total
        Booking existingBooking = booking.get();
        if (!amount.equals(existingBooking.getTotalAmount())) {
            throw new RuntimeException("Payment amount does not match booking total. Expected: " + 
                    existingBooking.getTotalAmount() + ", Received: " + amount);
        }

        // Create payment
        Payment payment = new Payment();
        payment.setBooking(existingBooking);
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("Completed");

        // Save payment
        Payment savedPayment = paymentRepository.save(payment);

        // Mark booking as completed
        bookingService.completeBooking(bookingId);

        return savedPayment;
    }

    /**
     * Get payment by ID
     */
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    /**
     * Get payment by booking ID
     */
    public Optional<Payment> getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    /**
     * Get all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /**
     * Get payments by status
     */
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }
}

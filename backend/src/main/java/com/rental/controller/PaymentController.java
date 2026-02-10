package com.rental.controller;

import com.rental.dto.PaymentDTO;
import com.rental.model.Payment;
import com.rental.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for Payment related endpoints
 */
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Process payment for a booking
     * POST /api/payment
     */
    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            Long bookingId = paymentDTO.getBookingId();
            Double amount = paymentDTO.getAmount();

            Payment payment = paymentService.processPayment(bookingId, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment processed successfully");
            response.put("paymentId", payment.getId());
            response.put("status", payment.getStatus());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get payment by booking ID
     * GET /api/payment/{bookingId}
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getPaymentByBookingId(@PathVariable Long bookingId) {
        try {
            Optional<Payment> payment = paymentService.getPaymentByBookingId(bookingId);
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Payment not found for booking");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

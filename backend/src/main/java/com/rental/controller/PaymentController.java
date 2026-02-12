package com.rental.controller;

import com.rental.dto.PaymentDTO;
import com.rental.mapper.BookingMapper;
import com.rental.model.Payment;
import com.rental.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payments", description = "Payment processing endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @Operation(summary = "Process payment for a booking")
    public ResponseEntity<Map<String, Object>> processPayment(
            @RequestParam Long bookingId,
            @RequestParam double amount,
            @RequestParam(defaultValue = "CREDIT_CARD") String paymentMethod) {
        Payment payment = paymentService.processPayment(bookingId, amount, paymentMethod);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Payment processed successfully",
                "transactionId", payment.getTransactionId(),
                "status", payment.getStatus().name(),
                "amount", payment.getAmount(),
                "bookingId", bookingId
        ));
    }

    @GetMapping("/{bookingId}")
    @Operation(summary = "Get payment by booking ID")
    public ResponseEntity<?> getPaymentByBookingId(@PathVariable Long bookingId) {
        return paymentService.getPaymentByBookingId(bookingId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

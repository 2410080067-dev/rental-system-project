package com.rental.mapper;

import com.rental.dto.BookingDTO;
import com.rental.model.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser() != null ? booking.getUser().getId() : null);
        dto.setUserName(booking.getUser() != null ? booking.getUser().getName() : null);
        dto.setVehicleId(booking.getVehicle() != null ? booking.getVehicle().getId() : null);
        dto.setVehicleName(booking.getVehicle() != null ? booking.getVehicle().getName() : null);
        dto.setVehicleImageUrl(booking.getVehicle() != null ? booking.getVehicle().getImageUrl() : null);
        dto.setVehicleCategory(booking.getVehicle() != null ? booking.getVehicle().getCategory() : null);
        dto.setVehiclePricePerDay(booking.getVehicle() != null ? booking.getVehicle().getPricePerDay() : null);
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus() != null ? booking.getStatus().name() : null);
        dto.setCreatedAt(booking.getCreatedAt() != null ? booking.getCreatedAt().toString() : null);
        return dto;
    }
}

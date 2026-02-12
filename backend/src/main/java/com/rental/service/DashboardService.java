package com.rental.service;

import com.rental.dto.DashboardDTO;
import com.rental.model.BookingStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final UserService userService;
    private final VehicleService vehicleService;
    private final BookingService bookingService;

    public DashboardService(UserService userService, VehicleService vehicleService,
                            BookingService bookingService) {
        this.userService = userService;
        this.vehicleService = vehicleService;
        this.bookingService = bookingService;
    }

    public DashboardDTO getDashboardStats() {
        DashboardDTO dashboard = new DashboardDTO();

        dashboard.setTotalUsers(userService.getUserCount());
        dashboard.setTotalVehicles(vehicleService.getVehicleCount());
        dashboard.setTotalBookings(bookingService.getBookingCount());
        dashboard.setTotalRevenue(bookingService.getTotalRevenue());
        dashboard.setActiveBookings(bookingService.getBookingCountByStatus(BookingStatus.APPROVED));
        dashboard.setCompletedBookings(bookingService.getBookingCountByStatus(BookingStatus.COMPLETED));
        dashboard.setCancelledBookings(bookingService.getBookingCountByStatus(BookingStatus.CANCELLED));
        dashboard.setPendingBookings(bookingService.getBookingCountByStatus(BookingStatus.PENDING));
        dashboard.setAvailableVehicles(vehicleService.getAvailableCount());

        // Monthly revenue
        int currentYear = LocalDate.now().getYear();
        List<Object[]> monthlyData = bookingService.getMonthlyRevenue(currentYear);
        List<DashboardDTO.MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();

        for (Object[] row : monthlyData) {
            String month = (String) row[0];
            double revenue = ((Number) row[1]).doubleValue();
            long bookings = ((Number) row[2]).longValue();
            monthlyRevenue.add(new DashboardDTO.MonthlyRevenueDTO(month, revenue, bookings));
        }

        dashboard.setMonthlyRevenue(monthlyRevenue);
        return dashboard;
    }
}

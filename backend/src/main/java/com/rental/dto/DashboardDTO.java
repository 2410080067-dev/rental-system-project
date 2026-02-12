package com.rental.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long totalUsers;
    private long totalVehicles;
    private long totalBookings;
    private double totalRevenue;
    private long activeBookings;
    private long completedBookings;
    private long cancelledBookings;
    private long pendingBookings;
    private long availableVehicles;
    private java.util.List<MonthlyRevenueDTO> monthlyRevenue;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyRevenueDTO {
        private String month;
        private double revenue;
        private long bookings;
    }
}

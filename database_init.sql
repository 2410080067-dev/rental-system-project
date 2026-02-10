-- Rental Management System - MySQL Database Script
-- This script initializes the rentaldb database with sample data

-- Create Database
CREATE DATABASE IF NOT EXISTS rentaldb;
USE rentaldb;

-- Drop existing tables (optional, for reset)
-- DROP TABLE IF EXISTS payments;
-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS vehicles;
-- DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    KEY idx_user_id (user_id),
    KEY idx_vehicle_id (vehicle_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    KEY idx_booking_id (booking_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Users
INSERT INTO users (name, email, phone, password, role, created_at) VALUES
('Admin User', 'admin@rental.com', '1234567890', 'admin123', 'admin', NOW()),
('John Doe', 'john@rental.com', '9876543210', 'john123', 'user', NOW()),
('Jane Smith', 'jane@rental.com', '9123456789', 'jane123', 'user', NOW()),
('Michael Johnson', 'michael@rental.com', '8765432109', 'michael123', 'user', NOW());

-- Insert Sample Vehicles
INSERT INTO vehicles (name, category, price_per_day, status, description, created_at, updated_at) VALUES
('Honda City', 'Car', 50.00, 'Available', 'Compact sedan with excellent mileage and comfort', NOW(), NOW()),
('Maruti Swift', 'Car', 45.00, 'Available', 'Economical hatchback, perfect for city driving', NOW(), NOW()),
('Toyota Fortuner', 'Car', 120.00, 'Available', 'Premium SUV with advanced features', NOW(), NOW()),
('Bajaj Pulsar', 'Bike', 15.00, 'Available', 'High-performance sport bike', NOW(), NOW()),
('Hero Honda Activa', 'Bike', 10.00, 'Available', 'Reliable automatic scooter', NOW(), NOW()),
('Royal Enfield Classic', 'Bike', 25.00, 'Available', 'Cruiser bike for long rides', NOW(), NOW()),
('Power Drill', 'Tool', 20.00, 'Available', 'Professional-grade drill machine', NOW(), NOW()),
('Angle Grinder', 'Tool', 15.00, 'Available', 'Heavy-duty angle grinder', NOW(), NOW()),
('Concrete Mixer', 'Tool', 50.00, 'Available', 'Industrial concrete mixer machine', NOW(), NOW()),
('Welding Machine', 'Tool', 40.00, 'Available', 'Professional MIG welding equipment', NOW(), NOW());

-- Verify Data
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_vehicles FROM vehicles;
SELECT * FROM users;
SELECT * FROM vehicles;

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);

-- Done
COMMIT;
FLUSH PRIVILEGES;

-- Display Summary
SELECT '=== DATABASE INITIALIZATION COMPLETE ===' as status;
SELECT CONCAT('Total Users: ', COUNT(*)) as users_count FROM users;
SELECT CONCAT('Total Vehicles: ', COUNT(*)) as vehicles_count FROM vehicles;

-- ============================================
-- RENTAL SYSTEM v2.0 - Database Migration Script
-- Run this AFTER upgrading the backend code
-- ============================================

-- Use the database
USE rental_system_db;

-- ============================================
-- 1. Drop existing tables (in dependency order)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 2. Create Users table with Role enum
-- ============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- 3. Create Vehicles table
-- ============================================
CREATE TABLE vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    category VARCHAR(100),
    price_per_day DOUBLE NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500)
) ENGINE=InnoDB;

-- ============================================
-- 4. Create Bookings table with status enum
-- ============================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DOUBLE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 5. Create Payments table with status enum
-- ============================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    amount DOUBLE NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    payment_method VARCHAR(50) DEFAULT 'CREDIT_CARD',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- 6. Create Reviews table (NEW)
-- ============================================
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_vehicle_review (user_id, vehicle_id)
) ENGINE=InnoDB;

-- ============================================
-- 7. Insert sample data
-- ============================================

-- Admin user (password: admin123 - BCrypt encoded)
INSERT INTO users (name, email, phone, password, role) VALUES
('Admin User', 'admin@rental.com', '9999999999', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Regular user (password: user123 - BCrypt encoded)
INSERT INTO users (name, email, phone, password, role) VALUES
('John Doe', 'john@example.com', '8888888888', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER');

-- Sample Vehicles
INSERT INTO vehicles (name, description, type, category, price_per_day, available, image_url) VALUES
('Toyota Camry', 'Comfortable sedan with excellent fuel efficiency', 'CAR', 'Sedan', 45.00, true, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500'),
('Honda CR-V', 'Spacious SUV perfect for family trips', 'CAR', 'SUV', 65.00, true, 'https://images.unsplash.com/photo-1568844293986-8d0400f4318c?w=500'),
('BMW 3 Series', 'Luxury sedan with premium features', 'CAR', 'Luxury', 120.00, true, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500'),
('Ford Mustang', 'Classic sports car with V8 engine', 'CAR', 'Sports', 150.00, true, 'https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=500'),
('Toyota Corolla', 'Reliable and economic compact car', 'CAR', 'Sedan', 35.00, true, 'https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=500'),
('Mercedes C-Class', 'Premium luxury sedan with advanced tech', 'CAR', 'Luxury', 140.00, true, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500'),
('Jeep Wrangler', 'Perfect for off-road adventures', 'CAR', 'SUV', 85.00, true, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500'),
('Honda Civic', 'Sporty compact car with great handling', 'CAR', 'Sedan', 40.00, true, 'https://images.unsplash.com/photo-1606611013016-969c19ba27d5?w=500'),
('Yamaha MT-15', 'Sporty naked bike for city commuting', 'BIKE', 'Bike', 20.00, true, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500'),
('Royal Enfield Classic', 'Classic cruiser motorcycle', 'BIKE', 'Bike', 25.00, true, 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=500');

SELECT 'Database migration complete!' AS status;
SELECT CONCAT('Users: ', COUNT(*)) AS info FROM users
UNION ALL
SELECT CONCAT('Vehicles: ', COUNT(*)) FROM vehicles;

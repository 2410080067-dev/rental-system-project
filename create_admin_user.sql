-- Create or verify admin user exists
-- Password: admin123 (BCrypt hashed)

USE rental_system_db;

-- Check if admin already exists
SELECT id, name, email, role FROM users WHERE email = 'admin@rental.com';

-- If admin doesn't exist, create it (uncomment the following lines)
-- INSERT INTO users (name, email, phone, password, role, created_at)
-- VALUES ('Admin User', 'admin@rental.com', '9999999999', 
--         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
--         'ADMIN', NOW());

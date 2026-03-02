-- Create Admin User immediately
-- Email: admin@rental.com
-- Password: admin123

USE rental_system_db;

-- Delete existing admin if any (optional - uncomment if needed)
-- DELETE FROM users WHERE email = 'admin@rental.com';

-- Create admin user with BCrypt hashed password
INSERT INTO users (name, email, phone, password, role, created_at)
VALUES ('Admin User', 'admin@rental.com', '9999999999', 
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
        'ADMIN', NOW())
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- Verify admin was created
SELECT id, name, email, role, created_at FROM users WHERE email = 'admin@rental.com';

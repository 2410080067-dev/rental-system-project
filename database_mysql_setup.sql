-- Create database and vehicles table (if needed), then insert sample data for rental_system_db

CREATE DATABASE IF NOT EXISTS rental_system_db;
USE rental_system_db;

-- If your existing vehicles table uses column `type`, rename it to `category`
-- ALTER TABLE vehicles CHANGE type category VARCHAR(50);

-- Create vehicles table if not exists (idempotent)
CREATE TABLE IF NOT EXISTS vehicles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  price_per_day DOUBLE,
  available BOOLEAN DEFAULT TRUE,
  image_url VARCHAR(1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data
INSERT INTO vehicles (name, category, price_per_day, available, image_url)
VALUES
('BMW X5', 'CAR', 5000, true, 'https://images.unsplash.com/photo-1549924231-f129b911e442'),
('Audi A6', 'CAR', 4500, true, 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9'),
('Royal Enfield Classic', 'BIKE', 1500, true, 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6'),
('Honda Activa', 'BIKE', 800, true, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2'),
('Bosch Drill Machine', 'TOOL', 500, true, 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8')
ON DUPLICATE KEY UPDATE name = VALUES(name);

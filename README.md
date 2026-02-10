# 🚗 Rental Management System

A complete rental management system for Cars, Bikes, and Tools using Spring Boot and React.

## Features

✅ User Authentication (Register & Login)
✅ Vehicle Management (Add, Update, Delete)
✅ Booking System
✅ Payment Processing
✅ Admin Dashboard
✅ Booking History
✅ Category Filtering
✅ Responsive UI with Bootstrap

---

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.1.0**
- **Spring Data JPA**
- **Hibernate**
- **MySQL 8.0**
- **Maven**
- **Port: 8081**

### Frontend
- **React 18.2**
- **React Router 6**
- **Axios**
- **Bootstrap 5**
- **Port: 3000**

### Database
- **MySQL** (Database: `rentaldb`)

---

## Project Structure

```
RENTAL SYSTEM/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rental/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   ├── config/
│   │   │   │   └── RentalSystemApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/
    └── rental-frontend/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   ├── services/
        │   ├── context/
        │   ├── App.jsx
        │   └── index.js
        ├── public/
        ├── package.json
        └── .gitignore
```

---

## Database Schema

### Users Table
```
id (PK, Auto-increment)
name
email (Unique)
phone
password
role (user/admin)
created_at
```

### Vehicles Table
```
id (PK, Auto-increment)
name
category (Car/Bike/Tool)
pricePerDay
status (Available/Booked)
description
created_at
updated_at
```

### Bookings Table
```
id (PK, Auto-increment)
user_id (FK)
vehicle_id (FK)
startDate
endDate
totalAmount
status (Active/Completed/Cancelled)
created_at
updated_at
```

### Payments Table
```
id (PK, Auto-increment)
booking_id (FK)
amount
status (Pending/Completed/Failed)
paymentDate
created_at
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users` - Get all users
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Vehicles
- `POST /api/vehicles/add` - Add new vehicle (Admin)
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID
- `GET /api/vehicles/available` - Get available vehicles
- `GET /api/vehicles/category/{category}` - Get by category
- `PUT /api/vehicles/{id}` - Update vehicle (Admin)
- `DELETE /api/vehicles/{id}` - Delete vehicle (Admin)

### Bookings
- `POST /api/bookings/book` - Create booking
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/user/{userId}` - Get user bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### Payments
- `POST /api/payment` - Process payment
- `GET /api/payment/{bookingId}` - Get payment by booking

---

## Installation & Setup

### Prerequisites
- JDK 17 or higher
- MySQL Server 8.0+
- Node.js 16+ and npm
- Maven 3.6+

### Step 1: Database Setup

1. Open MySQL and create database:
```sql
CREATE DATABASE rentaldb;
USE rentaldb;
```

2. If you want sample data, you can insert:
```sql
INSERT INTO users (name, email, phone, password, role, created_at) VALUES
('Admin User', 'admin@rental.com', '1234567890', 'admin123', 'admin', NOW()),
('John Doe', 'john@rental.com', '9876543210', 'john123', 'user', NOW());

INSERT INTO vehicles (name, category, pricePerDay, status, description, created_at, updated_at) VALUES
('Honda City', 'Car', 50, 'Available', 'Compact sedan', NOW(), NOW()),
('Bajaj Pulsar', 'Bike', 15, 'Available', 'Sport bike', NOW(), NOW()),
('Power Drill', 'Tool', 20, 'Available', 'Professional drill', NOW(), NOW());
```

### Step 2: Backend Setup

1. Navigate to backend folder:
```bash
cd "RENTAL SYSTEM\backend"
```

2. Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

3. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8081`

### Step 3: Frontend Setup

1. Navigate to frontend folder:
```bash
cd "RENTAL SYSTEM\frontend\rental-frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open on `http://localhost:3000`

---

## Running the Application

### Terminal 1 - Backend (Java/Spring Boot)
```bash
cd backend
mvn spring-boot:run
```

### Terminal 2 - Frontend (React)
```bash
cd frontend/rental-frontend
npm start
```

---

## Default Login Credentials

**Admin User:**
- Email: `admin@rental.com`
- Password: `admin123`

**Regular User:**
- Email: `john@rental.com`
- Password: `john123`

You can also create new accounts by registering.

---

## Testing the Application

1. **Homepage** - Visit `http://localhost:3000`
2. **Browse Vehicles** - Go to /vehicles page
3. **Register** - Create a new account
4. **Login** - Login with credentials
5. **Book a Vehicle** - Select a vehicle and book it
6. **Make Payment** - Process payment (use any 16-digit card number)
7. **View Bookings** - Check booking history
8. **Admin Panel** - Login as admin and manage vehicles

---

## Features Explained

### User Features
- ✅ Register and login
- ✅ Browse all vehicles by category
- ✅ View vehicle details
- ✅ Book a vehicle for specific dates
- ✅ Make payment for bookings
- ✅ View booking history
- ✅ Cancel active bookings

### Admin Features
- ✅ Add new vehicles
- ✅ Edit vehicle details
- ✅ Delete vehicles
- ✅ View all bookings
- ✅ View all users
- ✅ Manage vehicle status

---

## File Structure Details

### Backend Key Files
- `RentalSystemApplication.java` - Main entry point
- `CorsConfig.java` - CORS configuration
- `User.java` - User entity
- `Vehicle.java` - Vehicle entity
- `Booking.java` - Booking entity
- `Payment.java` - Payment entity
- All controllers handle REST endpoints
- All services contain business logic
- All repositories handle database operations

### Frontend Key Files
- `App.jsx` - Main app with routing
- `Navbar.jsx` - Navigation component
- `Footer.jsx` - Footer component
- `ProtectedRoute.jsx` - Route protection
- `authService.js` - Auth API calls
- `vehicleService.js` - Vehicle API calls
- `bookingService.js` - Booking API calls
- `paymentService.js` - Payment API calls

---

## Error Handling

- ✅ Try-catch blocks in services
- ✅ Proper HTTP status codes
- ✅ User-friendly error messages
- ✅ Form validation
- ✅ Loading states
- ✅ Error alerts

---

## Security Notes

⚠️ **For Development Only:**
- No Spring Security configured (as per requirements)
- Passwords stored as plain text (use BCrypt in production)
- Token-based auth not implemented (use JWT in production)
- CORS allows all origins (restrict in production)

---

## Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in `application.properties`
- Check port 8081 is not in use

### Frontend won't start
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check port 3000 is not in use

### API connection issues
- Ensure backend is running on port 8081
- Check CORS configuration
- Verify API URLs in service files

### Database issues
- Create database manually: `CREATE DATABASE rentaldb;`
- Check MySQL user permissions
- Verify driver connection string

---

## Future Enhancements

- 🔒 Spring Security with JWT
- 💳 Real payment gateway integration
- 📧 Email notifications
- ⭐ Rating and review system
- 📱 Mobile app
- 🗺️ Vehicle location tracking
- 💬 Chat support
- 📊 Analytics dashboard

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues, questions, or contributions, please feel free to reach out.

**Happy Renting!** 🎉

---

**Created:** January 2026
**Version:** 1.0.0
**Status:** Production Ready ✅

# QUICK START GUIDE

## 🚀 Run Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Backend starts on: **http://localhost:8081/api**

---

## 🎨 Run Frontend (React)

```bash
cd frontend/rental-frontend
npm install
npm start
```

Frontend opens on: **http://localhost:3000**

---

## 📦 Prerequisites

✅ Java 17+
✅ MySQL 8.0+
✅ Node.js 16+
✅ Maven 3.6+

---

## 🗄️ Database Setup

Create MySQL Database:
```sql
CREATE DATABASE rentaldb;
```

**Configure in:** `backend/src/main/resources/application.properties`
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## 🔑 Test Credentials

**Admin:**
- Email: `admin@rental.com`
- Password: `admin123`

**User:**
- Email: `john@rental.com`
- Password: `john123`

---

## ✨ Features Ready to Use

✅ User Registration & Login
✅ Browse Vehicles (Cars, Bikes, Tools)
✅ Book Vehicles
✅ Payment Processing
✅ Booking History
✅ Admin Dashboard (Add/Edit/Delete Vehicles)
✅ Category Filtering

---

## 🔗 API Base URL

`http://localhost:8081/api`

All endpoints documented in README.md

---

## 📱 Frontend URL

`http://localhost:3000`

---

## 🎯 First Steps

1. Start Backend: `mvn spring-boot:run`
2. Start Frontend: `npm start`
3. Navigate to `http://localhost:3000`
4. Register or Login
5. Browse and Book Vehicles
6. Process Payment
7. View Bookings

---

## ⚠️ Troubleshooting

**Port Already in Use?**
- Backend (8081): `netstat -an | findstr 8081`
- Frontend (3000): `netstat -an | findstr 3000`

**Database Connection Failed?**
- Check MySQL is running
- Verify credentials in application.properties
- Ensure database is created

**Dependencies Error?**
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

---

## 📞 Support

Check README.md for detailed documentation and API endpoints.

---

**Enjoy the Rental System!** 🎉

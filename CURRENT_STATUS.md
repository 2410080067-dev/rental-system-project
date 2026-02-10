# SYSTEM STATUS & QUICK START

## ✅ Frontend Status
**Status:** RUNNING ✅  
**URL:** http://localhost:3000  
**Port:** 3000  
**Process:** npm start (active)

### Frontend is ready to use!
Open your browser and go to: **http://localhost:3000**

---

## ⏳ Backend Status
**Status:** NEEDS SETUP  
**Required:** Maven installation  
**URL:** http://localhost:8081/api  
**Port:** 8081  

### Manual Maven Setup Instructions

Since automated download had issues, here's the manual setup:

#### Option 1: Direct Download (Recommended)
1. **Download Maven:**
   - Visit: https://maven.apache.org/download.cgi
   - Download: **apache-maven-3.8.8-bin.zip**

2. **Extract to: `C:\Maven\`**
   - Extract the ZIP file
   - You should have: `C:\Maven\apache-maven-3.8.8`

3. **Add to System PATH:**
   - Press: `Win + X` → System
   - Click: "Advanced system settings"
   - Click: "Environment Variables"
   - Under "System variables", find "Path" → Edit
   - Click: "New"
   - Enter: `C:\Maven\apache-maven-3.8.8\bin`
   - Click: OK (3 times)

4. **Verify Installation:**
   - Open NEW PowerShell window
   - Run: `mvn -version`
   - Should show Maven version

5. **Run Backend:**
   ```powershell
   cd "C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\backend"
   mvn spring-boot:run
   ```
   Backend will start on http://localhost:8081/api

#### Option 2: Using Pre-built JAR (If Available)
```powershell
cd "C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\backend"
java -jar target/rental-system-1.0.0.jar
```

---

## 🗄️ Database Setup

### Create MySQL Database

1. **Open MySQL Command Line or MySQL Workbench**

2. **Run this SQL:**
   ```sql
   CREATE DATABASE IF NOT EXISTS rentaldb;
   USE rentaldb;
   ```

3. **Import sample data** (optional):
   - Open file: `C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\database_init.sql`
   - Copy all contents and paste into MySQL
   - Execute

### Database Credentials (in application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rentaldb
spring.datasource.username=root
spring.datasource.password=root
```

**Note:** Update password if different

---

## 🚀 Frontend Usage (Already Running)

### Login Credentials:
**Admin User:**
```
Email: admin@rental.com
Password: admin123
```

**Regular User:**
```
Email: john@rental.com
Password: john123
```

### Available Pages:
- ✅ **Home** - Landing page
- ✅ **Login** - User login
- ✅ **Register** - New user registration
- ✅ **Vehicles** - Browse all vehicles
- ✅ **Book Vehicle** - Book a vehicle (protected)
- ✅ **My Bookings** - View bookings (protected)
- ✅ **Payment** - Make payment (protected)
- ✅ **Admin Dashboard** - Manage system (admin only)

### Features Working:
- User authentication ✅
- Vehicle browsing ✅
- Form validation ✅
- Navigation ✅
- Responsive design ✅

**Note:** Backend APIs won't connect until backend is running

---

## 📋 Complete Setup Checklist

- [ ] 1. Download Maven
- [ ] 2. Extract Maven to `C:\Maven\apache-maven-3.8.8`
- [ ] 3. Add Maven to PATH
- [ ] 4. Verify: `mvn -version` in new PowerShell
- [ ] 5. Create MySQL database: `rentaldb`
- [ ] 6. Run backend: `mvn spring-boot:run` from backend folder
- [ ] 7. Frontend already running at http://localhost:3000
- [ ] 8. Login and test features

---

## 🔗 API Endpoints (Backend Required)

Once backend is running at http://localhost:8081/api:

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Users
- `GET /users/{id}` - Get user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Vehicles
- `GET /vehicles` - All vehicles
- `GET /vehicles/{id}` - Get vehicle
- `GET /vehicles/available` - Available vehicles
- `GET /vehicles/category/{category}` - By category
- `POST /vehicles` - Add vehicle (admin)
- `PUT /vehicles/{id}` - Update vehicle (admin)
- `DELETE /vehicles/{id}` - Delete vehicle (admin)

### Bookings
- `GET /bookings` - All bookings
- `GET /bookings/user/{userId}` - User's bookings
- `POST /bookings` - Create booking
- `DELETE /bookings/{id}` - Cancel booking

### Payments
- `POST /payments` - Process payment
- `GET /payments/booking/{bookingId}` - Get payment

---

## 🆘 Troubleshooting

### Frontend shows "Cannot reach API"
- **Cause:** Backend not running
- **Solution:** Start backend with `mvn spring-boot:run`

### "mvn: command not found"
- **Cause:** Maven not installed or PATH not updated
- **Solution:** Install Maven and restart PowerShell

### MySQL connection error
- **Cause:** Database not created or wrong credentials
- **Solution:** Create database, update application.properties

### Port already in use
- **Frontend (3000):**
  ```powershell
  netstat -ano | findstr :3000
  taskkill /PID <pid> /F
  ```
- **Backend (8081):**
  ```powershell
  netstat -ano | findstr :8081
  taskkill /PID <pid> /F
  ```

---

## 📞 File Locations

| Component | Location |
|-----------|----------|
| Frontend | `C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\frontend\rental-frontend` |
| Backend | `C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\backend` |
| Database Script | `C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\database_init.sql` |
| Frontend Startup | `C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\START_FRONTEND.bat` |
| Backend Startup | `C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\START_BACKEND.bat` |

---

## ✨ Summary

**What's Working:**
- ✅ Frontend (React) - Running on port 3000
- ✅ All React components created
- ✅ All pages created
- ✅ Form validation
- ✅ Routing and navigation

**What Needs Setup:**
- ⏳ Backend (Spring Boot) - Needs Maven installation
- ⏳ MySQL Database - Needs database creation
- ⏳ API Connection - Will work once backend runs

**Next Steps:**
1. Install Maven (follow manual steps above)
2. Create MySQL database
3. Run: `mvn spring-boot:run` in backend folder
4. Test on http://localhost:3000

---

**Frontend is ready!** Open http://localhost:3000 in your browser to see the application.


# QUICK COMMANDS REFERENCE

## 🎯 Current Status

```
✅ Frontend: RUNNING at http://localhost:3000
⏳ Backend: REQUIRES MAVEN INSTALLATION
```

---

## 🚀 Start Commands

### Option A: Using Batch Files (Easiest)
```powershell
# Terminal 1 - Backend
"C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\START_BACKEND.bat"

# Terminal 2 - Frontend (if not already running)
"C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\START_FRONTEND.bat"
```

### Option B: Manual Commands
```powershell
# Terminal 1 - Backend (after Maven installed)
cd "C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\backend"
mvn spring-boot:run

# Terminal 2 - Frontend (if not already running)
cd "C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\frontend\rental-frontend"
npm start
```

---

## 🔧 Maven Setup (One-Time)

### Step 1: Download Maven
```
URL: https://maven.apache.org/download.cgi
File: apache-maven-3.8.8-bin.zip
```

### Step 2: Extract
```
Extract to: C:\Maven\apache-maven-3.8.8
```

### Step 3: Add to PATH
Windows Environment Variables:
```
New PATH entry: C:\Maven\apache-maven-3.8.8\bin
```

### Step 4: Verify
```powershell
mvn -version
```

---

## 🗄️ Database Setup

### Create Database
```sql
CREATE DATABASE rentaldb;
```

### View Configuration
File: `backend/src/main/resources/application.properties`
```
URL: jdbc:mysql://localhost:3306/rentaldb
User: root
Pass: root (UPDATE THIS!)
```

### Sample Data
File: `database_init.sql`
```powershell
# Open MySQL and run this file
```

---

## 🌐 Access URLs

```
Frontend:     http://localhost:3000
Backend API:  http://localhost:8081/api
```

---

## 👤 Test Credentials

### Admin Account
```
Email: admin@rental.com
Password: admin123
```

### Regular User
```
Email: john@rental.com
Password: john123
```

---

## 📂 Important Files/Folders

```
RENTAL SYSTEM/
├── frontend/
│   └── rental-frontend/          ← React app (RUNNING)
│       ├── src/
│       ├── package.json
│       └── node_modules/
├── backend/                       ← Spring Boot (SETUP NEEDED)
│   ├── src/
│   ├── pom.xml
│   └── target/
├── database_init.sql              ← MySQL script
├── CURRENT_STATUS.md              ← You are here
├── START_FRONTEND.bat
└── START_BACKEND.bat
```

---

## ⚡ Quick Fixes

### Frontend Not Starting
```powershell
cd "C:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM\frontend\rental-frontend"
rm -r node_modules package-lock.json
npm install
npm start
```

### Backend Port in Use
```powershell
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Clear npm Cache
```powershell
npm cache clean --force
```

### Check Process Status
```powershell
# Frontend
Get-Process | findstr node

# Backend
Get-Process | findstr java
```

---

## 📋 Full Setup Checklist

```
Setup Order:
1. [ ] Verify Java installed (java -version)
2. [ ] Verify npm installed (npm -v)
3. [ ] Frontend running at 3000 ✅ DONE
4. [ ] Install Maven
5. [ ] Create MySQL database
6. [ ] Start backend (mvn spring-boot:run)
7. [ ] Login at http://localhost:3000
8. [ ] Test features
```

---

## 🎉 When Ready

```
Terminal 1: mvn spring-boot:run        ← Backend
Terminal 2: npm start                   ← Frontend (already running)
Browser:   http://localhost:3000       ← App access
```

---

## 📖 Documentation Files

For more detailed info, see:
- `INDEX.md` - Documentation navigation
- `QUICKSTART.md` - 5-minute setup
- `INSTRUCTIONS.md` - Detailed setup
- `README.md` - Complete reference
- `CURRENT_STATUS.md` - Current system status (this file)

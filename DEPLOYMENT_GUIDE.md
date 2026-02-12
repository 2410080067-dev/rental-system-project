# Rental System — Complete Deployment Guide

> **Audience:** Beginners new to deployment. Every step is explained.
> **Stack:** Spring Boot 3.1 (Java 17) + React 18 + MySQL

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Step 1 — Push Code to GitHub](#3-step-1--push-code-to-github)
4. [Step 2 — Set Up Cloud MySQL Database](#4-step-2--set-up-cloud-mysql-database)
5. [Step 3 — Deploy Backend on Render](#5-step-3--deploy-backend-on-render)
6. [Step 4 — Deploy Frontend on Vercel](#6-step-4--deploy-frontend-on-vercel)
7. [Step 5 — Connect Frontend to Backend (CORS)](#7-step-5--connect-frontend-to-backend-cors)
8. [Step 6 — Environment Variables Reference](#8-step-6--environment-variables-reference)
9. [Step 7 — HTTPS & Custom Domain](#9-step-7--https--custom-domain)
10. [Step 8 — Production Security Checklist](#10-step-8--production-security-checklist)
11. [Alternative: Deploy Backend on Railway](#11-alternative-deploy-backend-on-railway)
12. [Alternative: Deploy Frontend on Netlify](#12-alternative-deploy-frontend-on-netlify)
13. [Troubleshooting](#13-troubleshooting)
14. [Cost Summary](#14-cost-summary)

---

## 1. Architecture Overview

```
┌─────────────────┐        HTTPS        ┌─────────────────────┐
│   React App     │ ──────────────────►  │  Spring Boot API    │
│   (Vercel)      │   API calls          │  (Render)           │
│   Port 443      │ ◄──────────────────  │  Port 8081          │
└─────────────────┘    JSON responses    └─────────┬───────────┘
     Browser                                       │
                                                   │ JDBC
                                                   ▼
                                          ┌─────────────────────┐
                                          │   MySQL Database     │
                                          │   (Clever Cloud /    │
                                          │    PlanetScale /     │
                                          │    Railway)          │
                                          └─────────────────────┘
```

**How it works:**
- **Frontend** (React) is built into static HTML/CSS/JS files and served by Vercel's CDN
- **Backend** (Spring Boot) runs as a Java server on Render and handles API requests
- **Database** (MySQL) runs on a cloud MySQL provider and stores all data
- Frontend talks to Backend via HTTPS API calls; Backend talks to Database via JDBC

---

## 2. Prerequisites

Before starting, make sure you have:

- [ ] A **GitHub account** (free) — [github.com](https://github.com)
- [ ] A **Render account** (free) — [render.com](https://render.com)
- [ ] A **Vercel account** (free) — [vercel.com](https://vercel.com)
- [ ] **Git** installed on your computer — [git-scm.com](https://git-scm.com)
- [ ] **Node.js 18+** installed — [nodejs.org](https://nodejs.org)
- [ ] Your Rental System project working locally

---

## 3. Step 1 — Push Code to GitHub

### 3.1 Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `rental-system`
3. Keep it **Public** (required for free Render tier) or **Private** if you have Render Pro
4. Do NOT add README, .gitignore, or license (we already have files)
5. Click **Create repository**

### 3.2 Create a .gitignore file

Create this file at the project root (`RENTAL SYSTEM/.gitignore`):

```gitignore
# Java / Maven
backend/target/
backend/.mvn/
backend/*.iml
backend/.idea/

# Node / React
frontend/rental-frontend/node_modules/
frontend/rental-frontend/build/
frontend/rental-frontend/.env.local
frontend/rental-frontend/.env.production.local

# OS files
.DS_Store
Thumbs.db

# Environment files with secrets
*.env.local
*.env.production.local
```

### 3.3 Push to GitHub

Open a terminal in your project root (`RENTAL SYSTEM` folder) and run:

```powershell
# Initialize git (if not already)
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Rental System full-stack app"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/rental-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify:** Go to your GitHub repo URL — you should see all your files.

---

## 4. Step 2 — Set Up Cloud MySQL Database

Your app needs a MySQL database accessible from the internet. Here are 3 options (pick ONE):

### Option A: Clever Cloud (Recommended — Free Tier)

1. Go to [clever-cloud.com](https://www.clever-cloud.com/) → Sign up
2. Click **Create** → **Add-on** → **MySQL**
3. Choose the **DEV** plan (free, 10MB storage)
4. Name it `rental-system-db`
5. After creation, go to **Environment Variables** tab and note down:
   - `MYSQL_ADDON_HOST` → This is your DATABASE_HOST
   - `MYSQL_ADDON_PORT` → This is your DATABASE_PORT
   - `MYSQL_ADDON_DB` → This is your DATABASE_NAME
   - `MYSQL_ADDON_USER` → This is your DATABASE_USERNAME
   - `MYSQL_ADDON_PASSWORD` → This is your DATABASE_PASSWORD
6. Build the JDBC URL:
   ```
   jdbc:mysql://DATABASE_HOST:DATABASE_PORT/DATABASE_NAME?useSSL=true&serverTimezone=UTC
   ```

### Option B: Railway (Easy — Free Trial)

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. Click **New Project** → **Provision MySQL**
3. Click on the MySQL service → **Variables** tab
4. Copy these values:
   - `MYSQL_URL` (or build it from MYSQLHOST, MYSQLPORT, MYSQLDATABASE)
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### Option C: PlanetScale (Generous Free Tier)

1. Go to [planetscale.com](https://planetscale.com) → Sign up
2. Create a database named `rental-system-db`
3. Click **Connect** → Choose **Java** → Copy the JDBC URL
4. Note: PlanetScale uses `sslMode=require` in the connection string

### After Setting Up the Database

Run the schema on your cloud database. You can use **MySQL Workbench** or the provider's web console:

```sql
-- Copy the contents of your database_mysql_setup.sql file and run it
-- This creates the tables: users, vehicles, bookings, payments, reviews
```

Then create the admin user:

```sql
-- Password is BCrypt hash of 'admin123'
INSERT INTO users (name, email, password, role, phone)
VALUES ('Admin', 'superadmin@rental.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'ADMIN', '1234567890');
```

---

## 5. Step 3 — Deploy Backend on Render

### 5.1 Create a Web Service

1. Go to [render.com](https://render.com) → Sign up / Log in
2. Click **New** → **Web Service**
3. Connect your GitHub account if not already connected
4. Select your `rental-system` repository
5. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `rental-system-api` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Instance Type** | `Free` |

### 5.2 Set Environment Variables

In Render's dashboard, go to **Environment** tab and add these:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `jdbc:mysql://HOST:PORT/DBNAME?useSSL=true&serverTimezone=UTC` | From Step 2 |
| `DATABASE_USERNAME` | (from Step 2) | Your cloud DB username |
| `DATABASE_PASSWORD` | (from Step 2) | Your cloud DB password |
| `JWT_SECRET` | `YourSuperSecureRandomString64CharsLong...` | Generate a strong random string! |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Your Vercel URL (set after Step 4) |
| `PORT` | `8081` | Server port |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production config |

> **IMPORTANT:** Generate a strong JWT secret! Run this in your terminal:
> ```powershell
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```
> Copy the output and use it as `JWT_SECRET`.

### 5.3 Deploy

1. Click **Create Web Service**
2. Render will:
   - Pull your code from GitHub
   - Build the Docker image (using your `backend/Dockerfile`)
   - Start the container
3. Wait 5-10 minutes for the first build
4. Your backend URL will be: `https://rental-system-api.onrender.com`

### 5.4 Verify Backend

Open in browser:
```
https://rental-system-api.onrender.com/api/vehicles
```
You should see a JSON array of vehicles (or `[]` if database is empty).

Swagger docs:
```
https://rental-system-api.onrender.com/swagger-ui/index.html
```

> **Note about Render Free Tier:** The free tier spins down after 15 minutes of inactivity. The first request after a spin-down takes 30-60 seconds. This is normal for free tier.

---

## 6. Step 4 — Deploy Frontend on Vercel

### 6.1 Update Production Environment

Edit `frontend/rental-frontend/.env.production`:

```env
REACT_APP_API_URL=https://rental-system-api.onrender.com
```

Replace `rental-system-api` with your actual Render service name.

**Commit and push:**
```powershell
git add .
git commit -m "Set production API URL"
git push
```

### 6.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up / Log in with GitHub
2. Click **Add New** → **Project**
3. Import your `rental-system` repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Project Name** | `rental-system` |
| **Framework Preset** | `Create React App` |
| **Root Directory** | `frontend/rental-frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |

5. Add Environment Variable:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | `https://rental-system-api.onrender.com` |

6. Click **Deploy**
7. Wait 1-2 minutes — it builds fast!
8. Your frontend URL will be: `https://rental-system.vercel.app`

### 6.3 Verify Frontend

1. Open `https://rental-system.vercel.app` in your browser
2. You should see the home page
3. Try logging in with `superadmin@rental.com` / `admin123`

---

## 7. Step 5 — Connect Frontend to Backend (CORS)

After deploying the frontend, you need to tell the backend to accept requests from your Vercel URL.

### 7.1 Update Render Environment Variable

1. Go to Render Dashboard → Your service → **Environment**
2. Update `CORS_ALLOWED_ORIGINS`:

```
https://rental-system.vercel.app
```

If you have multiple frontend URLs (e.g., custom domain), separate them with commas:
```
https://rental-system.vercel.app,https://www.yourdomain.com
```

3. Click **Save Changes** — Render will auto-redeploy

### 7.2 Test the Connection

1. Open your Vercel frontend URL
2. Open browser DevTools → **Network** tab
3. Click around the app — check that API calls return `200` (not `403` CORS error)
4. Try logging in, browsing vehicles, making a booking

**If you see CORS errors:** Double-check the `CORS_ALLOWED_ORIGINS` value matches your frontend URL exactly (including `https://`, no trailing slash).

---

## 8. Step 6 — Environment Variables Reference

### Backend (Render) — All Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `jdbc:mysql://host:3306/db?useSSL=true&serverTimezone=UTC` | Full JDBC URL |
| `DATABASE_USERNAME` | Yes | `u_rental` | DB username |
| `DATABASE_PASSWORD` | Yes | `p4ssw0rd!` | DB password |
| `JWT_SECRET` | Yes | `a1b2c3d4...` (64+ chars) | JWT signing key |
| `CORS_ALLOWED_ORIGINS` | Yes | `https://myapp.vercel.app` | Comma-separated frontend URLs |
| `PORT` | No | `8081` | Server port (default: 8081) |
| `SPRING_PROFILES_ACTIVE` | Yes | `prod` | Must be `prod` |

### Frontend (Vercel) — All Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | Yes | `https://rental-system-api.onrender.com` | Backend URL (NO trailing slash) |

---

## 9. Step 7 — HTTPS & Custom Domain

### HTTPS (Already Done!)

Both Render and Vercel provide **free HTTPS/SSL certificates** automatically. Your URLs already use `https://`.

### Custom Domain (Optional)

#### Buy a Domain
- **Namecheap** ($8-12/year): [namecheap.com](https://namecheap.com)
- **Google Domains** ($12/year): [domains.google](https://domains.google)
- **GoDaddy** ($10-15/year): [godaddy.com](https://godaddy.com)

#### Connect Domain to Vercel (Frontend)

1. In Vercel Dashboard → Your project → **Settings** → **Domains**
2. Type your domain: `www.myrentalapp.com`
3. Vercel gives you DNS records to add:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
4. Go to your domain registrar → **DNS Settings** → Add the CNAME record
5. Wait 5-30 minutes for DNS propagation
6. Vercel auto-provisions an SSL certificate

#### Connect Domain to Render (Backend API)

1. In Render Dashboard → Your service → **Settings** → **Custom Domains**
2. Add: `api.myrentalapp.com`
3. Render gives you a CNAME record to add
4. Add it in your domain registrar
5. Update `CORS_ALLOWED_ORIGINS` to include your custom domain
6. Update Vercel's `REACT_APP_API_URL` to `https://api.myrentalapp.com`

---

## 10. Step 8 — Production Security Checklist

### Must Do Before Going Live

- [x] **JWT Secret:** Use a strong random 64+ character string (NOT the dev default)
- [x] **Database Password:** Use a strong unique password (NOT `Hanwesh#123`)
- [x] **CORS Origins:** Only allow your specific frontend URL(s)
- [x] **HTTPS:** Enabled automatically by Render/Vercel
- [x] **SQL Logging:** Disabled in production (`show-sql=false` in `application-prod.properties`)
- [x] **Swagger:** Consider disabling in production by adding to `application-prod.properties`:
  ```properties
  springdoc.api-docs.enabled=false
  springdoc.swagger-ui.enabled=false
  ```
- [ ] **Rate Limiting:** Add to prevent abuse (optional for MVP)
- [ ] **Input Validation:** Already implemented with `@Valid` annotations

### Database Security

- Never expose database credentials in code or Git
- Use environment variables for all secrets
- Enable SSL for database connections (`useSSL=true`)

---

## 11. Alternative: Deploy Backend on Railway

If you prefer Railway over Render:

### 11.1 Set Up

1. Go to [railway.app](https://railway.app) → Log in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `rental-system` repository
4. Set **Root Directory** to `backend`

### 11.2 Configure

In **Variables** tab, add:

```
DATABASE_URL=jdbc:mysql://HOST:PORT/DB?useSSL=true&serverTimezone=UTC
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
JWT_SECRET=your_super_secure_secret_key
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
PORT=8081
SPRING_PROFILES_ACTIVE=prod
```

### 11.3 Configure Railway to Use Docker

In **Settings** tab:
- **Builder:** Dockerfile
- **Dockerfile Path:** `./Dockerfile`

Railway will auto-deploy. Your URL will be `https://rental-system-api-production.up.railway.app`.

> **Railway Pricing:** Free trial with $5 credit, then ~$5/month for hobby tier.

---

## 12. Alternative: Deploy Frontend on Netlify

If you prefer Netlify over Vercel:

### 12.1 Create a `_redirects` File

Since React uses client-side routing, create this file at:
`frontend/rental-frontend/public/_redirects`

```
/*    /index.html   200
```

This tells Netlify to serve `index.html` for all routes (required for React Router).

### 12.2 Deploy

1. Go to [netlify.com](https://netlify.com) → Sign up / Log in
2. Click **Add new site** → **Import an existing project** → GitHub
3. Select your repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Base directory** | `frontend/rental-frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/rental-frontend/build` |

5. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://rental-system-api.onrender.com`

6. Click **Deploy site**

---

## 13. Troubleshooting

### Problem: "Application Error" on Render

**Cause:** Build or startup failure.
**Fix:**
1. Go to Render Dashboard → Your service → **Logs**
2. Look for error messages
3. Common issues:
   - Wrong `DATABASE_URL` format
   - Database not accessible (check if cloud DB allows external connections)
   - Missing environment variables

### Problem: CORS Error in Browser Console

**Cause:** Backend rejecting requests from frontend origin.
**Fix:**
1. Check `CORS_ALLOWED_ORIGINS` in Render matches your frontend URL exactly
2. Must include `https://` prefix
3. No trailing slash
4. Redeploy backend after changing

### Problem: Frontend Shows Blank Page

**Cause:** React Router not configured for production hosting.
**Fix for Vercel:** Vercel handles this automatically for CRA apps.
**Fix for Netlify:** Add the `_redirects` file (see Section 12.1).

### Problem: API Calls Return 401

**Cause:** JWT token expired or invalid.
**Fix:**
1. Make sure `JWT_SECRET` in Render is set correctly
2. Clear browser localStorage and log in again
3. Check that the JWT expiration is reasonable (24h default)

### Problem: Render App Sleeps (Slow Cold Start)

**Cause:** Free tier spins down after 15 minutes.
**Fix Options:**
1. **Accept it** — first request takes 30-60s, then it's fast
2. **Use a pinger service** — [uptimerobot.com](https://uptimerobot.com) (free) can ping your app every 14 minutes
3. **Upgrade to Render Starter** ($7/month) — always-on instances

### Problem: Database Connection Timeout

**Cause:** Cloud DB has connection limits or network restrictions.
**Fix:**
1. Check if DB provider requires SSL (`useSSL=true` in URL)
2. Make sure DB allows connections from Render's IP range
3. Verify credentials are correct

---

## 14. Cost Summary

### Free Tier Stack (Recommended to Start)

| Service | Provider | Monthly Cost | Limitations |
|---------|----------|-------------|-------------|
| Backend | Render Free | $0 | Sleeps after 15min inactivity |
| Frontend | Vercel Free | $0 | 100GB bandwidth |
| Database | Clever Cloud Free | $0 | 10MB storage |
| **Total** | | **$0/month** | Perfect for portfolio/demo |

### Paid Stack (For Real Users)

| Service | Provider | Monthly Cost | Benefits |
|---------|----------|-------------|----------|
| Backend | Render Starter | $7 | Always-on, faster |
| Frontend | Vercel Pro | $20 | More bandwidth, analytics |
| Database | PlanetScale Scaler | $29 | 10GB storage, auto-scaling |
| **Total** | | **~$56/month** | Production-ready |

### Budget Stack (Best Value)

| Service | Provider | Monthly Cost | Benefits |
|---------|----------|-------------|----------|
| Backend | Railway Hobby | $5 | Always-on, simple |
| Frontend | Vercel Free | $0 | Still great for most apps |
| Database | Railway MySQL | $5 | 1GB storage |
| **Total** | | **~$10/month** | Good for small apps |

---

## Quick Start Checklist

After reading this guide, here's your deployment checklist:

1. [ ] Create GitHub repo and push code
2. [ ] Set up cloud MySQL database
3. [ ] Run SQL schema on cloud database
4. [ ] Deploy backend on Render with environment variables
5. [ ] Verify backend API works (`/api/vehicles`)
6. [ ] Update `.env.production` with backend URL
7. [ ] Deploy frontend on Vercel
8. [ ] Set `CORS_ALLOWED_ORIGINS` on Render to your Vercel URL
9. [ ] Test full flow: login, browse vehicles, book, pay
10. [ ] (Optional) Add custom domain
11. [ ] (Optional) Set up UptimeRobot to prevent Render sleep

---

**Congratulations!** Your Rental System is now live on the internet! 🎉

Share your URLs:
- Frontend: `https://rental-system.vercel.app`
- Backend API: `https://rental-system-api.onrender.com`
- Swagger Docs: `https://rental-system-api.onrender.com/swagger-ui/index.html`

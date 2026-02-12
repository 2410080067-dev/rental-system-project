# ============================================================
#  Rental Management System — Full Deployment Guide
#  From localhost to a public URL anyone can visit
# ============================================================
#
#  Tech Stack
#  ──────────
#  Frontend : React 18 (Vercel — free)
#  Backend  : Spring Boot 3.1 / Java 17 (Render — free)
#  Database : MySQL 8 (Aiven — free)
#
#  Final Architecture
#  ──────────────────
#
#  ┌──────────────┐  HTTPS   ┌───────────────────┐  SSL/TLS  ┌──────────────┐
#  │   Browser    │ ───────► │  Vercel (React)   │           │              │
#  │   (User)     │ ◄─────── │  rental.vercel.app│           │  Aiven MySQL │
#  └──────────────┘          └───────────────────┘           │  (Cloud DB)  │
#                                    │                       │              │
#                                    │ API calls (HTTPS)     └──────┬───────┘
#                                    ▼                              │
#                            ┌───────────────────┐    JDBC/SSL      │
#                            │ Render (Spring Boot│ ◄───────────────┘
#                            │  Docker container) │
#                            └───────────────────┘
#
# ============================================================


# ************************************************************
#  TABLE OF CONTENTS
# ************************************************************
#  PHASE 1 — Prerequisites & Accounts
#  PHASE 2 — Cloud MySQL Database (Aiven)
#  PHASE 3 — Deploy Backend on Render
#  PHASE 4 — Deploy Frontend on Vercel
#  PHASE 5 — Connect Everything
#  PHASE 6 — HTTPS / SSL (automatic)
#  PHASE 7 — Custom Domain (optional)
#  PHASE 8 — Production Hardening
#  PHASE 9 — Common Errors & Fixes
#  PHASE 10 — Folder Structure Explained
# ************************************************************


# ════════════════════════════════════════════════════════════
#  PHASE 1 — PREREQUISITES & ACCOUNTS  (15 minutes)
# ════════════════════════════════════════════════════════════

# 1.1  Create free accounts (all free, no credit card needed to start)
# ─────────────────────────────────────────────────────────────────────
#  ✅  GitHub   → https://github.com          (to host your code)
#  ✅  Render   → https://render.com          (to host Spring Boot backend)
#  ✅  Vercel   → https://vercel.com          (to host React frontend)
#  ✅  Aiven    → https://aiven.io            (free MySQL cloud database)
#
#  Sign up for ALL FOUR before proceeding.

# 1.2  Install Git (if not installed)
# ────────────────────────────────────
#  Download → https://git-scm.com/downloads
#  After install, verify:
git --version

# 1.3  Push your project to GitHub
# ─────────────────────────────────
#  Open a terminal in your project root folder:
cd "c:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM"

git init
git add .
git commit -m "Initial commit - Rental Management System"

#  Go to GitHub → New Repository → name it "rental-system"
#  Then run:
git remote add origin https://github.com/YOUR_USERNAME/rental-system.git
git branch -M main
git push -u origin main

#  ✅  Your code is now on GitHub!


# ════════════════════════════════════════════════════════════
#  PHASE 2 — CLOUD MySQL DATABASE (Aiven)  (10 minutes)
# ════════════════════════════════════════════════════════════
#
#  WHY? Your local MySQL won't be accessible online.
#  Aiven gives you a FREE cloud MySQL database.

# 2.1  Create the database
# ────────────────────────
#  1. Go to https://console.aiven.io
#  2. Click "Create service"
#  3. Choose "MySQL"
#  4. Plan: "Free" (Hobbyist)
#  5. Cloud: Google Cloud / AWS (pick closest region to you)
#  6. Service name: rental-system-db
#  7. Click "Create service"
#  8. Wait 2-3 minutes for it to spin up

# 2.2  Get your connection details
# ─────────────────────────────────
#  After creation, Aiven shows you:
#
#  Host:     mysql-xxxxx.aiven.io
#  Port:     12345
#  User:     avnadmin
#  Password: AVNS_xxxxxxxxxxxx
#  Database: defaultdb
#
#  ⚠️  SAVE THESE — you'll need them in Phase 3!

# 2.3  Build your DATABASE_URL
# ─────────────────────────────
#  Format:
#  jdbc:mysql://HOST:PORT/DATABASE?useSSL=true&requireSSL=true&serverTimezone=UTC
#
#  Example:
#  jdbc:mysql://mysql-rental-galia-rental.f.aivencloud.com:12345/defaultdb?useSSL=true&requireSSL=true&serverTimezone=UTC

# 2.4  Import your tables into cloud DB
# ───────────────────────────────────────
#  Option A: Using MySQL command line (if installed):
mysql -h mysql-xxxxx.aiven.io -P 12345 -u avnadmin -p --ssl-mode=REQUIRED < database_init.sql

#  Option B: Using MySQL Workbench (GUI):
#  1. Download MySQL Workbench → https://dev.mysql.com/downloads/workbench/
#  2. New Connection → paste Host, Port, User, Password
#  3. Enable "Use SSL" → Required
#  4. Open database_init.sql → Execute
#
#  Option C: Let Hibernate auto-create tables
#  (The app will create tables automatically thanks to ddl-auto=update)
#  But you'll need to insert sample data manually.

# 2.5  Alternative free MySQL providers
# ──────────────────────────────────────
#  If Aiven doesn't work for you:
#  - Railway     → https://railway.app       (MySQL add-on, gives you a JDBC URL directly)
#  - TiDB Cloud  → https://tidbcloud.com     (MySQL-compatible, free tier)
#  - FreeSQLDatabase → https://freesqldatabase.com  (simple free MySQL)


# ════════════════════════════════════════════════════════════
#  PHASE 3 — DEPLOY BACKEND ON RENDER  (15 minutes)
# ════════════════════════════════════════════════════════════

# 3.1  Create a new Web Service on Render
# ─────────────────────────────────────────
#  1. Go to https://dashboard.render.com
#  2. Click "New +" → "Web Service"
#  3. Connect your GitHub account
#  4. Select your "rental-system" repository
#  5. Configure:
#     ┌──────────────────────────────────────────────────────┐
#     │  Name:           rental-system-backend               │
#     │  Region:         Oregon (US West) or closest to you  │
#     │  Branch:         main                                │
#     │  Root Directory: backend                             │
#     │  Runtime:        Docker                              │
#     │  Instance Type:  Free                                │
#     └──────────────────────────────────────────────────────┘

# 3.2  Set Environment Variables on Render
# ─────────────────────────────────────────
#  In the Render dashboard → your service → "Environment" tab
#  Add these variables:
#
#  ┌────────────────────────┬──────────────────────────────────────────────────────────────────┐
#  │  Variable Name         │  Value                                                           │
#  ├────────────────────────┼──────────────────────────────────────────────────────────────────┤
#  │  PORT                  │  8081                                                            │
#  │  SPRING_PROFILES_ACTIVE│  prod                                                            │
#  │  DATABASE_URL          │  jdbc:mysql://HOST:PORT/DB?useSSL=true&requireSSL=true&...       │
#  │  DATABASE_USERNAME     │  avnadmin                                                        │
#  │  DATABASE_PASSWORD     │  (your Aiven password)                                           │
#  │  JWT_SECRET            │  (generate a random 64-char string — see below)                  │
#  │  CORS_ALLOWED_ORIGINS  │  https://your-frontend.vercel.app  (update after Phase 4)        │
#  └────────────────────────┴──────────────────────────────────────────────────────────────────┘
#
#  To generate a random JWT_SECRET, run this in PowerShell:
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
#
#  Or use: https://generate-secret.vercel.app/64

# 3.3  Deploy!
# ─────────────
#  Click "Create Web Service"
#  Render will:
#    1. Clone your repo
#    2. Build the Docker image (5-10 minutes first time)
#    3. Start the container
#    4. Give you a URL like: https://rental-system-backend.onrender.com
#
#  ⚠️  FREE TIER NOTE: The service sleeps after 15 min of inactivity.
#       First request after sleep takes ~30-60 seconds to wake up.

# 3.4  Test your backend
# ───────────────────────
#  Open in browser:
#  https://rental-system-backend.onrender.com/api/vehicles
#
#  You should see JSON with vehicle data!
#  If you see an error, check Render logs (Dashboard → Logs tab)


# ════════════════════════════════════════════════════════════
#  PHASE 4 — DEPLOY FRONTEND ON VERCEL  (10 minutes)
# ════════════════════════════════════════════════════════════

# 4.1  Update the frontend API URL
# ──────────────────────────────────
#  Edit: frontend/rental-frontend/.env.production
#  Change:
#    REACT_APP_API_URL=https://rental-system-backend.onrender.com
#
#  ⚠️  Use YOUR actual Render URL from Phase 3!

# 4.2  Commit and push
# ─────────────────────
cd "c:\Users\galia_9teax\OneDrive\Desktop\RENTAL SYSTEM"
git add .
git commit -m "Add production API URL"
git push origin main

# 4.3  Deploy on Vercel
# ──────────────────────
#  1. Go to https://vercel.com/dashboard
#  2. Click "Add New" → "Project"
#  3. Import your GitHub repository "rental-system"
#  4. Configure:
#     ┌──────────────────────────────────────────────────────┐
#     │  Framework Preset: Create React App                  │
#     │  Root Directory:   frontend/rental-frontend          │
#     │  Build Command:    npm run build                     │
#     │  Output Directory: build                             │
#     └──────────────────────────────────────────────────────┘
#
#  5. Environment Variables (in Vercel):
#     REACT_APP_API_URL = https://rental-system-backend.onrender.com
#
#  6. Click "Deploy"

# 4.4  Your site is live!
# ────────────────────────
#  Vercel gives you a URL like:
#  https://rental-frontend-xxxxx.vercel.app
#
#  ✅  Open it — your Rental System is now online!

# 4.5  Alternative: Deploy on Netlify
# ─────────────────────────────────────
#  1. Go to https://app.netlify.com
#  2. "Add new site" → "Import from Git" → select repo
#  3. Configure:
#     Base directory:  frontend/rental-frontend
#     Build command:   npm run build
#     Publish dir:     frontend/rental-frontend/build
#  4. Environment Variables:
#     REACT_APP_API_URL = https://rental-system-backend.onrender.com
#  5. Deploy!


# ════════════════════════════════════════════════════════════
#  PHASE 5 — CONNECT EVERYTHING  (5 minutes)
# ════════════════════════════════════════════════════════════

# 5.1  Update CORS on Render
# ───────────────────────────
#  Now that you have your Vercel URL, go back to Render:
#  Dashboard → rental-system-backend → Environment tab
#
#  Update:
#    CORS_ALLOWED_ORIGINS = https://rental-frontend-xxxxx.vercel.app
#
#  If you have multiple frontend URLs (Vercel + Netlify), separate with commas:
#    CORS_ALLOWED_ORIGINS = https://rental-frontend.vercel.app,https://rental-frontend.netlify.app
#
#  ⚠️  After changing env vars, Render will auto-redeploy.

# 5.2  Test the full flow
# ────────────────────────
#  1. Open your Vercel URL
#  2. Register a new user
#  3. Login
#  4. Browse vehicles
#  5. Make a booking
#  6. Check booking history
#
#  If something fails, check:
#  - Render logs (Dashboard → Logs)
#  - Browser console (F12 → Console tab)
#  - Network tab (F12 → Network) for failed API calls


# ════════════════════════════════════════════════════════════
#  PHASE 6 — HTTPS / SSL  (automatic!)
# ════════════════════════════════════════════════════════════
#
#  Great news — BOTH Render and Vercel give you FREE HTTPS automatically!
#
#  ✅  Vercel:  https://your-app.vercel.app       ← automatic SSL
#  ✅  Render:  https://your-app.onrender.com     ← automatic SSL
#  ✅  Aiven:   MySQL connection uses SSL by default
#
#  You DON'T need to configure any certificates.
#  Both platforms auto-renew SSL certificates for you.
#
#  Your application-prod.properties already has useSSL=true for MySQL.


# ════════════════════════════════════════════════════════════
#  PHASE 7 — CUSTOM DOMAIN (optional)
# ════════════════════════════════════════════════════════════

# 7.1  Buy a domain
# ──────────────────
#  Cheap providers:
#  - Namecheap   → https://namecheap.com      (~$9/year for .com)
#  - GoDaddy     → https://godaddy.com
#  - Google Domains → https://domains.google
#  - Cloudflare  → https://cloudflare.com      (at-cost pricing)

# 7.2  Connect domain to Vercel (frontend)
# ──────────────────────────────────────────
#  1. Vercel Dashboard → your project → Settings → Domains
#  2. Add your domain: rental.yourdomain.com
#  3. Vercel shows you DNS records to add
#  4. Go to your domain provider's DNS settings
#  5. Add:
#       Type: CNAME
#       Name: rental (or @ for root domain)
#       Value: cname.vercel-dns.com
#  6. Wait 5-15 minutes for DNS propagation
#  7. Vercel auto-provisions SSL for your domain!

# 7.3  Connect domain to Render (backend)
# ─────────────────────────────────────────
#  1. Render Dashboard → your service → Settings → Custom Domains
#  2. Add: api.yourdomain.com
#  3. Add DNS records as instructed:
#       Type: CNAME
#       Name: api
#       Value: rental-system-backend.onrender.com
#  4. Render auto-provisions SSL!

# 7.4  Update URLs after custom domain
# ──────────────────────────────────────
#  Frontend .env.production:
#    REACT_APP_API_URL=https://api.yourdomain.com
#
#  Render env vars:
#    CORS_ALLOWED_ORIGINS=https://rental.yourdomain.com


# ════════════════════════════════════════════════════════════
#  PHASE 8 — PRODUCTION HARDENING
# ════════════════════════════════════════════════════════════

# 8.1  Security Checklist
# ────────────────────────
#  ✅  JWT_SECRET environment variable set (not hardcoded)
#  ✅  Database password in env vars (not in code)
#  ✅  CORS restricted to your frontend URL only
#  ✅  HTTPS enforced (automatic on Render/Vercel)
#  ✅  BCrypt password hashing (already in your SecurityConfig)
#  ✅  Stateless JWT sessions (already configured)
#  ✅  Non-root Docker user (already in Dockerfile)
#  ✅  SQL injection protection (JPA parameterized queries)
#  ✅  ddl-auto=update (safe for production with care)

# 8.2  Performance Checklist
# ───────────────────────────
#  ✅  HikariCP connection pool (configured in application-prod.properties)
#  ✅  show-sql=false in production
#  ✅  Static assets cached (vercel.json headers)
#  ✅  Gzip compression (automatic on Vercel)
#  ✅  React production build (minified, tree-shaken)
#  ✅  Multi-stage Docker build (smaller image)

# 8.3  Monitoring
# ────────────────
#  Render: Built-in metrics (Dashboard → Metrics tab)
#  - CPU usage, Memory usage, Response times
#
#  Vercel: Built-in analytics
#  - vercel.com/analytics (free for hobby plan)
#
#  Optional: Add a health endpoint to your backend
#  GET /api/auth/health → returns { "status": "UP" }


# ════════════════════════════════════════════════════════════
#  PHASE 9 — COMMON ERRORS & FIXES
# ════════════════════════════════════════════════════════════

# ┌─────────────────────────────────────┬──────────────────────────────────────────────────────┐
# │  ERROR                              │  FIX                                                 │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  CORS error in browser console      │  Update CORS_ALLOWED_ORIGINS env var on Render       │
# │                                     │  to match your exact Vercel URL (no trailing slash)  │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  "Network Error" on API calls       │  Check REACT_APP_API_URL in Vercel env vars.         │
# │                                     │  Make sure it does NOT have /api at the end           │
# │                                     │  (context-path adds /api automatically)              │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  Backend returns 502 / 503          │  Check Render logs. Common causes:                   │
# │                                     │  - Database connection failed (wrong credentials)    │
# │                                     │  - Port mismatch (PORT env var must be set)           │
# │                                     │  - Service is sleeping (free tier — wait 30s)        │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  "Access denied" for MySQL user     │  Double-check DATABASE_USERNAME and PASSWORD          │
# │                                     │  on Render env vars. Copy directly from Aiven.       │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  "Communications link failure"      │  MySQL cloud DB may have SSL requirement.             │
# │                                     │  Ensure DATABASE_URL has useSSL=true&requireSSL=true │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  Build fails on Render              │  Check Dockerfile exists in backend/ folder.          │
# │                                     │  Ensure Root Directory is set to "backend"            │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  React blank page on Vercel         │  Check vercel.json has SPA rewrite rule               │
# │                                     │  Ensure Root Directory = "frontend/rental-frontend"  │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  404 on page refresh (Vercel)       │  The vercel.json rewrite rule handles this.           │
# │                                     │  If using Netlify, check _redirects file exists      │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  "JWT signature mismatch"           │  Your JWT_SECRET on Render must match locally.        │
# │                                     │  Generate a new 64-char secret and set it.           │
# ├─────────────────────────────────────┼──────────────────────────────────────────────────────┤
# │  Slow first load (~30s)             │  Normal on Render free tier. Server sleeps after      │
# │                                     │  15 min of inactivity. Consider paid plan ($7/mo)    │
# └─────────────────────────────────────┴──────────────────────────────────────────────────────┘


# ════════════════════════════════════════════════════════════
#  PHASE 10 — PROJECT STRUCTURE EXPLAINED
# ════════════════════════════════════════════════════════════

#  RENTAL SYSTEM/
#  │
#  ├── backend/                        ← Spring Boot application
#  │   ├── Dockerfile                  ← Docker config for Render deployment
#  │   ├── pom.xml                     ← Maven dependencies & build config
#  │   ├── mvnw / mvnw.cmd            ← Maven wrapper (build without installing Maven)
#  │   └── src/main/
#  │       ├── java/com/rental/        ← Java source code
#  │       │   ├── config/             ← SecurityConfig, CORS, OpenAPI
#  │       │   ├── controller/         ← REST API endpoints
#  │       │   ├── model/              ← JPA entities (User, Vehicle, Booking)
#  │       │   ├── repository/         ← Data access layer
#  │       │   ├── service/            ← Business logic
#  │       │   └── security/           ← JWT filter, auth logic
#  │       └── resources/
#  │           ├── application.properties       ← DEV config (localhost)
#  │           └── application-prod.properties  ← PROD config (env vars)
#  │
#  ├── frontend/rental-frontend/       ← React application
#  │   ├── package.json                ← NPM dependencies & scripts
#  │   ├── vercel.json                 ← Vercel deployment config (SPA rewrites)
#  │   ├── netlify.toml                ← Netlify deployment config (alternative)
#  │   ├── .env.production             ← Production API URL
#  │   ├── .env.development            ← Dev API URL (localhost)
#  │   ├── public/index.html           ← HTML template
#  │   └── src/
#  │       ├── App.jsx                 ← Routes & layout
#  │       ├── services/api.js         ← Axios instance (reads REACT_APP_API_URL)
#  │       ├── services/*Service.js    ← API call functions
#  │       ├── components/             ← Shared UI (Navbar, Footer)
#  │       ├── context/                ← React context (auth state)
#  │       └── pages/                  ← Page components
#  │
#  └── database_init.sql               ← SQL to create tables + sample data

#  DEPLOYMENT ARCHITECTURE:
#  ─────────────────────────
#
#  ┌─────────────────────────────────────────────────────────────────────────┐
#  │                         PUBLIC INTERNET                                │
#  │                                                                       │
#  │  ┌───────────────────────┐        ┌──────────────────────────┐        │
#  │  │    VERCEL (Free)      │        │     RENDER (Free)        │        │
#  │  │                       │        │                          │        │
#  │  │  React Production     │ HTTPS  │  Docker Container       │        │
#  │  │  Build (static files) │───────►│  Spring Boot + Java 17  │        │
#  │  │                       │  API   │                          │        │
#  │  │  Serves: index.html,  │ calls  │  Serves: REST APIs      │        │
#  │  │  JS, CSS bundles      │        │  /api/auth, /api/vehicles│        │
#  │  │                       │        │  /api/bookings, etc.     │        │
#  │  │  URL: *.vercel.app    │        │  URL: *.onrender.com     │        │
#  │  │  SSL: ✅ Automatic    │        │  SSL: ✅ Automatic       │        │
#  │  └───────────────────────┘        └────────────┬─────────────┘        │
#  │                                                │                      │
#  │                                    JDBC + SSL  │                      │
#  │                                                ▼                      │
#  │                                   ┌────────────────────┐              │
#  │                                   │   AIVEN MySQL      │              │
#  │                                   │   (Free Tier)      │              │
#  │                                   │                    │              │
#  │                                   │   Tables:          │              │
#  │                                   │   - users          │              │
#  │                                   │   - vehicles       │              │
#  │                                   │   - bookings       │              │
#  │                                   │   - payments       │              │
#  │                                   │                    │              │
#  │                                   │   SSL: ✅ Required │              │
#  │                                   └────────────────────┘              │
#  └─────────────────────────────────────────────────────────────────────────┘


# ════════════════════════════════════════════════════════════
#  QUICK REFERENCE — ALL ENVIRONMENT VARIABLES
# ════════════════════════════════════════════════════════════

#  ┌───────────────────────────────────────────────────────────────────┐
#  │  RENDER (Backend) Environment Variables                          │
#  ├─────────────────────────┬─────────────────────────────────────────┤
#  │  PORT                   │  8081                                   │
#  │  SPRING_PROFILES_ACTIVE │  prod                                   │
#  │  DATABASE_URL           │  jdbc:mysql://host:port/db?useSSL=true  │
#  │  DATABASE_USERNAME      │  avnadmin                               │
#  │  DATABASE_PASSWORD      │  (from Aiven)                           │
#  │  JWT_SECRET             │  (64-char random string)                │
#  │  CORS_ALLOWED_ORIGINS   │  https://your-app.vercel.app            │
#  └─────────────────────────┴─────────────────────────────────────────┘
#
#  ┌───────────────────────────────────────────────────────────────────┐
#  │  VERCEL (Frontend) Environment Variables                         │
#  ├─────────────────────────┬─────────────────────────────────────────┤
#  │  REACT_APP_API_URL      │  https://your-backend.onrender.com     │
#  └─────────────────────────┴─────────────────────────────────────────┘


# ════════════════════════════════════════════════════════════
#  DONE! 🎉 YOUR RENTAL SYSTEM IS NOW LIVE!
# ════════════════════════════════════════════════════════════
#
#  Summary of what we set up:
#  ✅  Cloud MySQL database (Aiven) — your data lives online
#  ✅  Spring Boot backend (Render) — your APIs are publicly accessible
#  ✅  React frontend (Vercel) — your website is live with a URL
#  ✅  HTTPS/SSL — automatic, encrypted connections everywhere
#  ✅  CORS — frontend ↔ backend communication secured
#  ✅  Env vars — no passwords in your code
#  ✅  Production config — optimized logging, connection pooling, security
#
#  Total cost: $0/month (all free tiers)
#
#  To share with anyone:
#  Just send them your Vercel URL → https://your-app.vercel.app

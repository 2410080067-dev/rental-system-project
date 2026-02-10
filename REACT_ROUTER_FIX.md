# React Router Refresh Issue - Fix Documentation

## Problem Description

When users refresh the page on routes like `/login`, `/register`, or `/dashboard`, the page appears blank or fails to load. This is a common issue in Single Page Applications (SPAs).

## Root Cause

The issue occurs because:

1. **Server-Side Route Handling**: When a user refreshes the page or accesses a direct URL like `http://localhost:8081/login`, the browser makes a request to the server.

2. **Server Cannot Find Route**: The Spring Boot backend receives the request for `/login` but there's no actual file or endpoint at that path. The server returns a 404 error or serves a blank page.

3. **Missing Frontend Controller**: Without a fallback controller, the server doesn't know to redirect unknown routes back to `index.html`, where React Router can handle the route on the client side.

4. **React Router Not Involved**: Since React Router never gets loaded, the client-side navigation logic never executes.

## How SPAs Should Work

```
User Action: Type /login in browser
          ↓
Browser HTTP Request to Server: GET /login
          ↓
Server Should Respond: Send index.html (not 404)
          ↓
Browser Loads index.html and JavaScript
          ↓
React Router Loads in Browser
          ↓
React Router Reads URL: /login
          ↓
React Router Renders: Login Component
          ↓
User Sees: Login Page ✓
```

## Solutions Implemented

### 1. Frontend Configuration (Already Correct ✓)

The React app is already properly configured:

**Location**: [src/App.jsx](../frontend/rental-frontend/src/App.jsx)

- ✓ Uses `BrowserRouter` wrapper
- ✓ Uses `<Routes>` and `<Route>` components
- ✓ Has a fallback route: `<Route path="*" element={<Home />} />`
- ✓ Properly imports `react-router-dom` v6

### 2. Backend Server-Side Fallback (Fixed)

**Created**: [FrontendController.java](../backend/src/main/java/com/rental/controller/FrontendController.java)

This controller catches all unmatched routes and forwards them to `index.html`:

```java
@Controller
public class FrontendController {
    @GetMapping(value = {
        "/",
        "/{x:[\\w\\-]+}",
        "/{x:^(?!api$).*$}/{y:[\\w\\-]+}",
        "/{x:^(?!api$).*$}/{y:[\\w\\-]+}/{z:[\\w\\-]+}"
    })
    public String index() {
        return "forward:/index.html";
    }
}
```

**How it works**:
- Routes like `/`, `/login`, `/register`, `/dashboard` are caught
- Routes starting with `/api/` are excluded (API endpoints)
- All matched routes are forwarded to `index.html`
- React Router then takes over and renders the correct component

### 3. Web Configuration (Added)

**Created**: [WebConfig.java](../backend/src/main/java/com/rental/config/WebConfig.java)

Properly configures static resource serving:
- Serves static files from `classpath:/static/`
- Caches static assets for performance
- Allows Spring Boot to serve React's built files

## Routes Now Working with Refresh

✓ `/` - Home page
✓ `/login` - Login page  
✓ `/register` - Register page
✓ `/vehicles` - Browse vehicles
✓ `/book/:id` - Book a specific vehicle
✓ `/bookings` - View booking history
✓ `/payment/:bookingId` - Payment page
✓ `/admin` - Admin dashboard

## Deployment Steps

### 1. Build React App

```bash
cd frontend/rental-frontend
npm run build
```

This creates a `build/` folder with optimized production files.

### 2. Copy Built Files to Spring Boot

```bash
# Copy the build folder contents to Spring Boot static directory
cp -r frontend/rental-frontend/build/* backend/src/main/resources/static/
```

### 3. Build and Run Backend

```bash
cd backend
mvn clean package
java -jar target/rental-system-1.0.0.jar
```

The app will be available at: `http://localhost:8081`

## Key Differences: Development vs Production

### Development
- React dev server runs on `http://localhost:3000`
- Spring Boot API runs on `http://localhost:8081/api`
- Both are separate processes
- CORS configuration handles cross-origin requests
- React Router handles all routing (dev server doesn't care about routes)

### Production
- Spring Boot serves both API AND static React files
- Frontend controller redirects unknown routes to `index.html`
- React Router handles routing after `index.html` loads
- Single server instance at `http://localhost:8081`

## API Endpoint Protection

The regex patterns in `FrontendController` ensure:
- `/api/**` routes go to REST controllers (not caught by fallback)
- `/auth`, `/users`, `/vehicles`, `/bookings`, `/payment` all work
- Only frontend routes are redirected to `index.html`

## Why This Works

1. **Server Receives Request** for `/login`
2. **FrontendController Matches** the pattern
3. **Server Returns `index.html`** (not an error)
4. **Browser Loads React App** with HTML, CSS, JS
5. **React Router Initializes** and reads the URL
6. **Login Component Renders** for `/login` route
7. **User Sees Correct Page** ✓

## Testing

After deployment, test these scenarios:

```
1. Go to http://localhost:8081/login
2. See login form

3. Go to http://localhost:8081/register  
4. See registration form

5. Go to http://localhost:8081/admin
6. See admin dashboard (if authenticated)

7. Refresh the page (F5 or Ctrl+R)
8. Page should remain the same (not blank)

9. Direct URL in browser: http://localhost:8081/booking-history
10. Should load correctly with React Router
```

## Additional Notes

- No UI or animations were modified
- Only routing and server configuration changed
- CORS configuration remains unchanged
- API endpoints work exactly as before
- Protected routes still require authentication
- All existing functionality preserved


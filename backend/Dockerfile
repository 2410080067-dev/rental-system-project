# ============================================
# Multi-stage Dockerfile for Rental System Backend
# Optimized for Render free-tier deployment
# ============================================

# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Run the application (lightweight image)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Switch to non-root user
USER appuser

# Render uses the PORT environment variable
EXPOSE ${PORT:-8081}

# Health check for Render
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8081}/api/auth/health || exit 1

# Run with production profile
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "-Dspring.profiles.active=prod", "app.jar"]

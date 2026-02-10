# MySQL Setup for Rental System Backend

This file explains how to create the `rentaldb` database and verify the connection from Spring Boot.

1. Ensure MySQL server is running on localhost (default port 3306).
2. Create the database and initial tables using the provided SQL script:

```sql
-- Run in MySQL client or MySQL Workbench
SOURCE "../database_init.sql";
```

Or execute the contents of `database_init.sql` in MySQL Workbench:
- Open MySQL Workbench
- Connect to `Local instance MySQL` (or your connection)
- Open a new SQL tab and paste the contents of `database_init.sql`
- Execute the script (lightning bolt icon)

3. Verify connection in MySQL Workbench:
- After script executes, expand `Schemas` and look for `rentaldb`.
- Expand `Tables` → you should see `users`, `vehicles`, `bookings`, `payments`.

4. Spring Boot configuration (already set):
- File: `src/main/resources/application.properties`
- Ensure the following values match your MySQL user/password:

```
spring.datasource.url=jdbc:mysql://localhost:3306/rentaldb?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

5. Start the backend:

```bash
# from backend folder
mvn spring-boot:run
```

Expected logs:
- "Tomcat started on port(s): 8081"
- "Started RentalSystemApplication"

6. Troubleshooting:
- If you see DataSource connection errors, double-check username/password and that MySQL is listening on 127.0.0.1:3306.
- On Windows, ensure MySQL service is running (Services or `net start MySQL`)
- Use `mysql -u root -p` to test credentials from a terminal.


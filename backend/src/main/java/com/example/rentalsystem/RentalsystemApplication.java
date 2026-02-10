package com.example.rentalsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.rental", "com.example.rentalsystem"})
@EnableJpaRepositories(basePackages = {"com.rental.repository"})
@EntityScan(basePackages = {"com.rental.model"})
public class RentalsystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentalsystemApplication.class, args);
    }
}

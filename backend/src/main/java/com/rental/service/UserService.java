package com.rental.service;

import com.rental.model.User;
import com.rental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for User-related business logic
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new user
     */
    public User registerUser(User user) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user");
        }

        return userRepository.save(user);
    }

    /**
     * Login user with email and password
     */
    public Optional<User> loginUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    /**
     * Get user by ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Get user by email
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Update user
     */
    public User updateUser(Long id, User userDetails) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            if (userDetails.getName() != null) {
                existingUser.setName(userDetails.getName());
            }
            if (userDetails.getEmail() != null) {
                existingUser.setEmail(userDetails.getEmail());
            }
            if (userDetails.getPhone() != null) {
                existingUser.setPhone(userDetails.getPhone());
            }
            if (userDetails.getPassword() != null) {
                existingUser.setPassword(userDetails.getPassword());
            }
            return userRepository.save(existingUser);
        }
        throw new RuntimeException("User not found with id: " + id);
    }

    /**
     * Delete user
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

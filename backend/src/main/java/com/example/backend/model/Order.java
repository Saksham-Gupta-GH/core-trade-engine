package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "User ID cannot be empty")
    @Column(nullable = false)
    private String userId;

    @NotBlank(message = "Symbol cannot be empty")
    @Column(nullable = false)
    private String symbol;

    @NotBlank(message = "Side (BUY/SELL) cannot be empty")
    @Column(nullable = false)
    private String side; // "BUY" or "SELL"

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be strictly positive")
    @Column(nullable = false)
    private Double price;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be strictly positive")
    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer filledQuantity = 0;

    @Column(nullable = false)
    private String status = "OPEN"; // "OPEN", "PARTIALLY_FILLED", "FILLED", "CANCELED"

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

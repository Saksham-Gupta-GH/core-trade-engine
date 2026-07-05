package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String symbol;
    private String side; // BUY or SELL
    private Double price;
    private Integer quantity;
    private Integer filledQuantity = 0;
    private String status; // OPEN, FILLED, PARTIALLY_FILLED, CANCELED

    private LocalDateTime createdAt = LocalDateTime.now();
}

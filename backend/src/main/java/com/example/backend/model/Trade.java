package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
@Data
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;
    private Double price;
    private Integer quantity;
    
    private Long buyerOrderId;
    private Long sellerOrderId;

    private LocalDateTime executedAt = LocalDateTime.now();
}

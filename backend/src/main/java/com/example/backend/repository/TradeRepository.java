package com.example.backend.repository;

import com.example.backend.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface TradeRepository extends JpaRepository<Trade, Long> {
    void deleteByExecutedAtBefore(LocalDateTime cutoff);
}

package com.example.backend.repository;

import com.example.backend.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface TradeRepository extends JpaRepository<Trade, Long> {
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Trade t WHERE t.executedAt < ?1")
    void deleteByExecutedAtBefore(LocalDateTime cutoff);
}

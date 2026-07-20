package com.example.backend.repository;

import com.example.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusIn(List<String> statuses);
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Order o WHERE o.createdAt < ?1")
    void deleteByCreatedAtBefore(LocalDateTime cutoff);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Order o SET o.status = 'CANCELED' WHERE o.userId = 'market_maker_bot' AND o.status IN ?1")
    int cancelBotOrders(List<String> statuses);
}

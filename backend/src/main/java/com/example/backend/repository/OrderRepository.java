package com.example.backend.repository;

import com.example.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusIn(List<String> statuses);
    void deleteByCreatedAtBefore(LocalDateTime cutoff);
}

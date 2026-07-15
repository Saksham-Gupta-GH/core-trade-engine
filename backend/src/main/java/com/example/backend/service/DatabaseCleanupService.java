package com.example.backend.service;

import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DatabaseCleanupService {

    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;

    /**
     * Runs every day at midnight (00:00).
     * Deletes all trades and orders older than 24 hours to prevent the 
     * free tier database from filling up with automated market maker activity.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanupOldRecords() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        
        log.info("Starting nightly database cleanup for records older than {}...", cutoff);
        
        // Delete old trades first since they may conceptually reference orders
        tradeRepository.deleteByExecutedAtBefore(cutoff);
        
        // Delete old orders
        orderRepository.deleteByCreatedAtBefore(cutoff);
        
        log.info("Database cleanup completed successfully.");
    }

    /**
     * Runs every 5 minutes (300000 ms).
     * Cancels old market maker bot orders so they don't accumulate indefinitely.
     */
    @Scheduled(fixedRate = 300000)
    public void cleanupBotOrders() {
        int canceledCount = orderRepository.cancelBotOrders(java.util.List.of("OPEN", "PARTIALLY_FILLED"));
        if (canceledCount > 0) {
            log.info("Scheduled cleanup: canceled {} old market maker bot orders.", canceledCount);
        }
    }
}

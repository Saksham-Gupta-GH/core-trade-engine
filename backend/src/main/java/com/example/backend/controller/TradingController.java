package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.Trade;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.TradeRepository;
import com.example.backend.service.MatchingEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows Next.js to call this API
@RequiredArgsConstructor
public class TradingController {

    private final MatchingEngineService matchingEngineService;
    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;

    @PostMapping("/orders")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        Order processedOrder = matchingEngineService.processOrder(order);
        return ResponseEntity.ok(processedOrder);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/trades")
    public ResponseEntity<List<Trade>> getTrades() {
        return ResponseEntity.ok(tradeRepository.findAll());
    }
}

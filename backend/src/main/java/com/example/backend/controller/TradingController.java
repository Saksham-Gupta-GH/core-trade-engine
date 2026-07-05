package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.Trade;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.TradeRepository;
import com.example.backend.service.MatchingEngineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${frontend.url:http://localhost:3000}")
@RequiredArgsConstructor
public class TradingController {

    private final MatchingEngineService matchingEngineService;
    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;

    @PostMapping("/orders")
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody Order order) {
        Order processedOrder = matchingEngineService.processOrder(order);
        return ResponseEntity.ok(processedOrder);
    }

    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        matchingEngineService.cancelOrder(id);
        return ResponseEntity.ok().build();
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

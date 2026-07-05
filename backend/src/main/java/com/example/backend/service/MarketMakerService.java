package com.example.backend.service;

import com.example.backend.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketMakerService {

    private final MatchingEngineService matchingEngineService;
    private final Random random = new Random();

    private final Map<String, Double> SYMBOL_PRICES = Map.of(
            "AAPL", 150.0,
            "MSFT", 400.0,
            "GOOGL", 2800.0
    );
    private final List<String> SYMBOLS = List.copyOf(SYMBOL_PRICES.keySet());

    @Scheduled(fixedRate = 3000)
    public void simulateMarketActivity() {
        String symbol = SYMBOLS.get(random.nextInt(SYMBOLS.size()));
        String side = random.nextBoolean() ? "BUY" : "SELL";
        
        double basePrice = SYMBOL_PRICES.get(symbol);
        
        // Generate a random price around the base price
        // +/- 1.5% volatility
        double volatility = basePrice * 0.015; 
        double priceOffset = (random.nextDouble() - 0.5) * (volatility * 2);
        double price = Math.round((basePrice + priceOffset) * 100.0) / 100.0;
        
        int quantity = (random.nextInt(10) + 1) * 10; // 10 to 100 shares

        Order order = new Order();
        order.setUserId("market_maker_bot");
        order.setSymbol(symbol);
        order.setSide(side);
        order.setOrderType("LIMIT");
        order.setPrice(price);
        order.setQuantity(quantity);

        log.debug("Market Maker placing order: {} {} {} @ ${}", side, quantity, symbol, price);
        matchingEngineService.processOrder(order);
    }
}

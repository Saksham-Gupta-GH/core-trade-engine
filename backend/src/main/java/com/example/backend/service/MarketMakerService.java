package com.example.backend.service;

import com.example.backend.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketMakerService {

    private final MatchingEngineService matchingEngineService;
    private final Random random = new Random();

    private final List<String> SYMBOLS = List.of("AAPL", "MSFT", "GOOGL");
    private final double BASE_PRICE = 150.0;

    @Scheduled(fixedRate = 3000)
    public void simulateMarketActivity() {
        String symbol = SYMBOLS.get(random.nextInt(SYMBOLS.size()));
        String side = random.nextBoolean() ? "BUY" : "SELL";
        
        // Generate a random price around the base price
        double priceOffset = (random.nextDouble() - 0.5) * 5.0; // +/- $2.50
        double price = Math.round((BASE_PRICE + priceOffset) * 100.0) / 100.0;
        
        int quantity = (random.nextInt(10) + 1) * 10; // 10 to 100 shares

        Order order = new Order();
        order.setUserId("market_maker_bot");
        order.setSymbol(symbol);
        order.setSide(side);
        order.setPrice(price);
        order.setQuantity(quantity);

        log.debug("Market Maker placing order: {} {} {} @ ${}", side, quantity, symbol, price);
        matchingEngineService.processOrder(order);
    }
}

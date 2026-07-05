package com.example.backend.service;

import com.example.backend.model.Order;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.TradeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class MatchingEngineServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private TradeRepository tradeRepository;

    @InjectMocks
    private MatchingEngineService matchingEngineService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(orderRepository.findByStatusIn(anyList())).thenReturn(Collections.emptyList());
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);
        matchingEngineService.init();
    }

    @Test
    void testExactMatch() {
        Order sell = createOrder("AAPL", "SELL", 150.0, 10);
        matchingEngineService.processOrder(sell);

        Order buy = createOrder("AAPL", "BUY", 150.0, 10);
        matchingEngineService.processOrder(buy);

        verify(tradeRepository, times(1)).save(any());
        assertEquals("FILLED", sell.getStatus());
        assertEquals("FILLED", buy.getStatus());
    }

    @Test
    void testPartialFill() {
        Order sell = createOrder("AAPL", "SELL", 150.0, 20);
        matchingEngineService.processOrder(sell);

        Order buy = createOrder("AAPL", "BUY", 150.0, 10);
        matchingEngineService.processOrder(buy);

        verify(tradeRepository, times(1)).save(any());
        assertEquals("PARTIALLY_FILLED", sell.getStatus());
        assertEquals(10, sell.getFilledQuantity());
        assertEquals("FILLED", buy.getStatus());
    }

    @Test
    void testNoMatchDifferentSymbols() {
        Order sell = createOrder("AAPL", "SELL", 150.0, 10);
        matchingEngineService.processOrder(sell);

        Order buy = createOrder("MSFT", "BUY", 150.0, 10);
        matchingEngineService.processOrder(buy);

        verify(tradeRepository, never()).save(any());
        assertEquals("OPEN", sell.getStatus());
        assertEquals("OPEN", buy.getStatus());
    }

    @Test
    void testPriceTimePriority() throws InterruptedException {
        Order sell1 = createOrder("AAPL", "SELL", 150.0, 10);
        matchingEngineService.processOrder(sell1);
        
        Thread.sleep(10); // Ensure different timestamps

        Order sell2 = createOrder("AAPL", "SELL", 145.0, 10);
        matchingEngineService.processOrder(sell2);

        Order buy = createOrder("AAPL", "BUY", 155.0, 10);
        matchingEngineService.processOrder(buy);

        // Buy should match with sell2 because it has a better (lower) price
        assertEquals("FILLED", sell2.getStatus());
        assertEquals("OPEN", sell1.getStatus());
        assertEquals("FILLED", buy.getStatus());
    }

    private Order createOrder(String symbol, String side, Double price, Integer quantity) {
        Order o = new Order();
        o.setId((long) (Math.random() * 1000));
        o.setSymbol(symbol);
        o.setSide(side);
        o.setPrice(price);
        o.setQuantity(quantity);
        o.setFilledQuantity(0);
        o.setStatus("OPEN");
        return o;
    }
}

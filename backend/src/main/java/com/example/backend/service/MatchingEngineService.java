package com.example.backend.service;

import com.example.backend.model.Order;
import com.example.backend.model.Trade;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.TradeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingEngineService {

    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;

    // Thread-safe map of OrderBooks, keyed by asset symbol (e.g., "AAPL")
    private final Map<String, OrderBook> orderBooks = new ConcurrentHashMap<>();

    private OrderBook getOrderBook(String symbol) {
        return orderBooks.computeIfAbsent(symbol.toUpperCase(), k -> new OrderBook());
    }

    @PostConstruct
    public void init() {
        log.info("Cleaning up old bot orders...");
        List<Order> openOrders = orderRepository.findByStatusIn(List.of("OPEN", "PARTIALLY_FILLED"));
        for (Order order : openOrders) {
            if ("market_maker_bot".equals(order.getUserId())) {
                order.setStatus("CANCELED");
                orderRepository.save(order);
            } else {
                getOrderBook(order.getSymbol()).addOrder(order);
            }
        }
        log.info("Loaded {} open user orders.", openOrders.stream().filter(o -> !"market_maker_bot".equals(o.getUserId())).count());
    }

    @Transactional
    public Order processOrder(Order newOrder) {
        newOrder.setStatus("OPEN");
        newOrder.setSymbol(newOrder.getSymbol().toUpperCase());
        newOrder = orderRepository.save(newOrder);

        OrderBook book = getOrderBook(newOrder.getSymbol());
        
        if ("BUY".equalsIgnoreCase(newOrder.getSide())) {
            book.matchBuyOrder(newOrder, orderRepository, tradeRepository);
            if (newOrder.getQuantity() > newOrder.getFilledQuantity()) {
                if ("MARKET".equalsIgnoreCase(newOrder.getOrderType())) {
                    newOrder.setStatus("CANCELED"); // Unfilled market orders are canceled
                } else {
                    book.addOrder(newOrder);
                }
            }
        } else {
            book.matchSellOrder(newOrder, orderRepository, tradeRepository);
            if (newOrder.getQuantity() > newOrder.getFilledQuantity()) {
                if ("MARKET".equalsIgnoreCase(newOrder.getOrderType())) {
                    newOrder.setStatus("CANCELED"); // Unfilled market orders are canceled
                } else {
                    book.addOrder(newOrder);
                }
            }
        }
        
        return orderRepository.save(newOrder);
    }
    
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if ("FILLED".equals(order.getStatus()) || "CANCELED".equals(order.getStatus())) {
            throw new IllegalStateException("Order is already filled or canceled");
        }
        
        order.setStatus("CANCELED");
        orderRepository.save(order);
        log.info("Order {} canceled", orderId);
        // The PriorityQueue will lazily discard this order when it surfaces during matching because its status is CANCELED.
    }

    // Inner class to encapsulate the PriorityQueues and synchronize matching per symbol
    private static class OrderBook {
        private final PriorityQueue<Order> buyOrders = new PriorityQueue<>(
                Comparator.comparing(Order::getPrice).reversed()
                        .thenComparing(Order::getCreatedAt)
        );

        private final PriorityQueue<Order> sellOrders = new PriorityQueue<>(
                Comparator.comparing(Order::getPrice)
                        .thenComparing(Order::getCreatedAt)
        );

        public synchronized void addOrder(Order order) {
            if ("BUY".equalsIgnoreCase(order.getSide())) {
                buyOrders.add(order);
            } else {
                sellOrders.add(order);
            }
        }

        public synchronized void matchBuyOrder(Order buyOrder, OrderRepository orderRepo, TradeRepository tradeRepo) {
            boolean isMarket = "MARKET".equalsIgnoreCase(buyOrder.getOrderType());
            
            while (!sellOrders.isEmpty() && buyOrder.getQuantity() > buyOrder.getFilledQuantity()) {
                Order bestSell = sellOrders.peek();
                
                // Lazy deletion check
                if ("CANCELED".equals(bestSell.getStatus())) {
                    sellOrders.poll();
                    continue;
                }
                
                if (isMarket || buyOrder.getPrice() >= bestSell.getPrice()) {
                    executeTrade(buyOrder, bestSell, orderRepo, tradeRepo, bestSell.getPrice());
                    if (bestSell.getQuantity().equals(bestSell.getFilledQuantity())) {
                        sellOrders.poll();
                    }
                } else {
                    break;
                }
            }
        }

        public synchronized void matchSellOrder(Order sellOrder, OrderRepository orderRepo, TradeRepository tradeRepo) {
            boolean isMarket = "MARKET".equalsIgnoreCase(sellOrder.getOrderType());
            
            while (!buyOrders.isEmpty() && sellOrder.getQuantity() > sellOrder.getFilledQuantity()) {
                Order bestBuy = buyOrders.peek();
                
                // Lazy deletion check
                if ("CANCELED".equals(bestBuy.getStatus())) {
                    buyOrders.poll();
                    continue;
                }
                
                if (isMarket || sellOrder.getPrice() <= bestBuy.getPrice()) {
                    executeTrade(bestBuy, sellOrder, orderRepo, tradeRepo, bestBuy.getPrice());
                    if (bestBuy.getQuantity().equals(bestBuy.getFilledQuantity())) {
                        buyOrders.poll();
                    }
                } else {
                    break;
                }
            }
        }

        private void executeTrade(Order buyOrder, Order sellOrder, OrderRepository orderRepo, TradeRepository tradeRepo, Double executionPrice) {
            int tradeQuantity = Math.min(
                    buyOrder.getQuantity() - buyOrder.getFilledQuantity(),
                    sellOrder.getQuantity() - sellOrder.getFilledQuantity()
            );

            buyOrder.setFilledQuantity(buyOrder.getFilledQuantity() + tradeQuantity);
            sellOrder.setFilledQuantity(sellOrder.getFilledQuantity() + tradeQuantity);

            buyOrder.setStatus(buyOrder.getFilledQuantity().equals(buyOrder.getQuantity()) ? "FILLED" : "PARTIALLY_FILLED");
            sellOrder.setStatus(sellOrder.getFilledQuantity().equals(sellOrder.getQuantity()) ? "FILLED" : "PARTIALLY_FILLED");

            orderRepo.save(buyOrder);
            orderRepo.save(sellOrder);

            Trade trade = new Trade();
            trade.setSymbol(buyOrder.getSymbol());
            trade.setPrice(executionPrice);
            trade.setQuantity(tradeQuantity);
            trade.setBuyerOrderId(buyOrder.getId());
            trade.setSellerOrderId(sellOrder.getId());
            tradeRepo.save(trade);
            
            log.info("TRADE EXECUTED: {} shares of {} at ${}", tradeQuantity, trade.getSymbol(), executionPrice);
        }
    }
}

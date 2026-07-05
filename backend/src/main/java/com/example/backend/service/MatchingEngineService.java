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

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingEngineService {

    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;

    // Bids (Buys) sorted by Price Descending, then Time Ascending
    private final PriorityQueue<Order> buyOrders = new PriorityQueue<>(
            Comparator.comparing(Order::getPrice).reversed()
                    .thenComparing(Order::getCreatedAt)
    );

    // Asks (Sells) sorted by Price Ascending, then Time Ascending
    private final PriorityQueue<Order> sellOrders = new PriorityQueue<>(
            Comparator.comparing(Order::getPrice)
                    .thenComparing(Order::getCreatedAt)
    );

    @PostConstruct
    public void init() {
        log.info("Initializing Order Books from Database...");
        List<Order> openOrders = orderRepository.findByStatusIn(List.of("OPEN", "PARTIALLY_FILLED"));
        for (Order order : openOrders) {
            if ("BUY".equalsIgnoreCase(order.getSide())) {
                buyOrders.add(order);
            } else {
                sellOrders.add(order);
            }
        }
        log.info("Loaded {} open orders.", openOrders.size());
    }

    @Transactional
    public Order processOrder(Order newOrder) {
        newOrder.setStatus("OPEN");
        newOrder = orderRepository.save(newOrder);

        if ("BUY".equalsIgnoreCase(newOrder.getSide())) {
            matchBuyOrder(newOrder);
            if (newOrder.getQuantity() > newOrder.getFilledQuantity()) {
                buyOrders.add(newOrder);
            }
        } else {
            matchSellOrder(newOrder);
            if (newOrder.getQuantity() > newOrder.getFilledQuantity()) {
                sellOrders.add(newOrder);
            }
        }
        
        return orderRepository.save(newOrder);
    }

    private void matchBuyOrder(Order buyOrder) {
        while (!sellOrders.isEmpty() && buyOrder.getQuantity() > buyOrder.getFilledQuantity()) {
            Order bestSell = sellOrders.peek();
            
            if (buyOrder.getPrice() >= bestSell.getPrice()) {
                executeTrade(buyOrder, bestSell);
                if (bestSell.getQuantity().equals(bestSell.getFilledQuantity())) {
                    sellOrders.poll(); // Remove fully filled order
                }
            } else {
                break; // No more matching prices
            }
        }
    }

    private void matchSellOrder(Order sellOrder) {
        while (!buyOrders.isEmpty() && sellOrder.getQuantity() > sellOrder.getFilledQuantity()) {
            Order bestBuy = buyOrders.peek();
            
            if (sellOrder.getPrice() <= bestBuy.getPrice()) {
                executeTrade(bestBuy, sellOrder);
                if (bestBuy.getQuantity().equals(bestBuy.getFilledQuantity())) {
                    buyOrders.poll();
                }
            } else {
                break;
            }
        }
    }

    private void executeTrade(Order buyOrder, Order sellOrder) {
        int tradeQuantity = Math.min(
                buyOrder.getQuantity() - buyOrder.getFilledQuantity(),
                sellOrder.getQuantity() - sellOrder.getFilledQuantity()
        );
        
        Double tradePrice = sellOrder.getPrice(); // Simplified: Trade executes at the maker's price

        buyOrder.setFilledQuantity(buyOrder.getFilledQuantity() + tradeQuantity);
        sellOrder.setFilledQuantity(sellOrder.getFilledQuantity() + tradeQuantity);

        buyOrder.setStatus(buyOrder.getFilledQuantity().equals(buyOrder.getQuantity()) ? "FILLED" : "PARTIALLY_FILLED");
        sellOrder.setStatus(sellOrder.getFilledQuantity().equals(sellOrder.getQuantity()) ? "FILLED" : "PARTIALLY_FILLED");

        orderRepository.save(buyOrder);
        orderRepository.save(sellOrder);

        Trade trade = new Trade();
        trade.setSymbol(buyOrder.getSymbol());
        trade.setPrice(tradePrice);
        trade.setQuantity(tradeQuantity);
        trade.setBuyerOrderId(buyOrder.getId());
        trade.setSellerOrderId(sellOrder.getId());
        tradeRepository.save(trade);
        
        log.info("TRADE EXECUTED: {} shares of {} at ${}", tradeQuantity, trade.getSymbol(), tradePrice);
    }
}

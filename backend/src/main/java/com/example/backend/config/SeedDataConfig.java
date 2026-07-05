package com.example.backend.config;

import com.example.backend.model.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner initDatabase(OrderRepository orderRepository) {
        return args -> {
            if (orderRepository.count() == 0) {
                Order o1 = new Order();
                o1.setUserId("user1");
                o1.setSymbol("AAPL");
                o1.setSide("BUY");
                o1.setPrice(150.0);
                o1.setQuantity(10);
                o1.setStatus("OPEN");
                
                Order o2 = new Order();
                o2.setUserId("user2");
                o2.setSymbol("AAPL");
                o2.setSide("SELL");
                o2.setPrice(155.0);
                o2.setQuantity(15);
                o2.setStatus("OPEN");

                Order o3 = new Order();
                o3.setUserId("user3");
                o3.setSymbol("MSFT");
                o3.setSide("BUY");
                o3.setPrice(300.0);
                o3.setQuantity(5);
                o3.setStatus("OPEN");

                orderRepository.saveAll(List.of(o1, o2, o3));
                System.out.println("Seeded database with initial orders!");
            }
        };
    }
}

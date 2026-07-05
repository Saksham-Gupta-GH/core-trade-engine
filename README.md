# Core Trade Engine

**Live Demo:** [https://core-trade-engine.vercel.app/trade](https://core-trade-engine.vercel.app/trade)

A high-performance, enterprise-grade financial matching engine built with **Java (Spring Boot)** and **Next.js**. This project simulates the core infrastructure of a cryptocurrency or stock exchange, capable of matching limit orders in real-time with strict Price-Time priority.

## 🚀 Key Features

* **Thread-Safe Matching Engine:** The core matching algorithm utilizes `ConcurrentHashMap` to shard order books by asset symbol (e.g., AAPL, MSFT, GOOGL), ensuring thread-safe, concurrent trade execution across multiple assets simultaneously.
* **Price-Time Priority Queues:** Bids and Asks are organized using highly optimized `PriorityQueue` structures, guaranteeing that the best prices are executed first, and ties are broken by the earliest arrival time.
* **O(1) Lazy Order Cancellation:** Order cancellation avoids the O(N) penalty of arbitrary PriorityQueue removal by employing a lazy deletion strategy, marking orders as canceled in the database and discarding them instantly when they reach the top of the queue.
* **Simulated Market Maker:** A built-in Spring Boot scheduled service runs a market maker bot that injects randomized organic trading activity into the order books every 3 seconds, bringing the live price charts to life.
* **Live Trading Dashboard:** A Bloomberg-inspired dark mode trading terminal built with Next.js and Tailwind CSS, featuring a live `recharts` price graph, order cancellation, and animated real-time feed updates.

## 🏗️ Architecture Stack

* **Backend:** Java 17, Spring Boot, Hibernate/JPA
* **Database:** PostgreSQL (Supabase)
* **Frontend:** React, Next.js, Tailwind CSS, Recharts
* **Deployment:** Render (Backend), Vercel (Frontend)

## 💻 Local Development

### 1. Start the Java Backend
1. Provide a PostgreSQL database url in the `application.properties` or via environment variables (`DB_URL`, `DB_USER`, `DB_PASSWORD`).
2. Run the Spring Boot application:
```bash
cd backend
./gradlew bootRun
```

### 2. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Then open `http://localhost:3000` in your browser.

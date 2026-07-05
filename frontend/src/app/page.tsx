"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  symbol: string;
  side: string;
  price: number;
  quantity: number;
  filledQuantity: number;
  status: string;
}

interface Trade {
  id: number;
  symbol: string;
  price: number;
  quantity: number;
  executedAt: string;
}

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState("AAPL");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [side, setSide] = useState("BUY");

  const fetchData = async () => {
    try {
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/orders`);
      const ordersData = await ordersRes.json();
      setOrders(ordersData.filter((o: Order) => o.status !== "FILLED"));

      const tradesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/trades`);
      const tradesData = await tradesRes.json();
      setTrades(tradesData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo_user",
          symbol,
          side,
          price: parseFloat(price),
          quantity: parseInt(quantity),
        }),
      });
      setPrice("");
      setQuantity("");
      fetchData();
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  const bids = orders.filter((o) => o.side === "BUY").sort((a, b) => b.price - a.price);
  const asks = orders.filter((o) => o.side === "SELL").sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-gray-900 font-sans pb-16">
      {/* TripAdvisor Style Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="bg-[#34e0a1] w-10 h-10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black tracking-tight">CoreTrade</h1>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Saksham-Gupta-GH/core-trade-engine" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 rounded-full transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-3">Explore the Market</h2>
          <p className="text-gray-600 text-lg md:text-xl">Discover real-time trading powered by a high-performance Java matching engine.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Book & Trades */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Order Book Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-black">Live Order Book</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">
                  <span>Price (USD)</span>
                  <span className="text-right">Quantity</span>
                  <span className="text-right">Total</span>
                </div>
                
                {/* Asks (Sells) */}
                <div className="space-y-1 mb-6 flex flex-col-reverse">
                  {asks.slice(0, 5).map((ask, i) => (
                    <div key={`ask-${i}`} className="grid grid-cols-3 text-sm hover:bg-gray-50 rounded px-2 py-1 transition-colors relative">
                      <span className="text-red-600 font-medium z-10">{ask.price.toFixed(2)}</span>
                      <span className="text-right text-gray-700 z-10">{ask.quantity - ask.filledQuantity}</span>
                      <span className="text-right text-gray-500 z-10">{(ask.price * (ask.quantity - ask.filledQuantity)).toFixed(2)}</span>
                      <div className="absolute top-0 right-0 h-full bg-red-50 rounded" style={{ width: `${Math.min(100, ((ask.quantity - ask.filledQuantity) / 50) * 100)}%` }}></div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-b border-gray-100 py-3 my-3 text-center text-gray-800 font-black text-xl">
                  {asks.length > 0 && bids.length > 0 
                    ? ((asks[0].price + bids[0].price) / 2).toFixed(2) 
                    : "Market Spread"}
                </div>

                {/* Bids (Buys) */}
                <div className="space-y-1 mt-6">
                  {bids.slice(0, 5).map((bid, i) => (
                    <div key={`bid-${i}`} className="grid grid-cols-3 text-sm hover:bg-gray-50 rounded px-2 py-1 transition-colors relative">
                      <span className="text-[#00aa6c] font-medium z-10">{bid.price.toFixed(2)}</span>
                      <span className="text-right text-gray-700 z-10">{bid.quantity - bid.filledQuantity}</span>
                      <span className="text-right text-gray-500 z-10">{(bid.price * (bid.quantity - bid.filledQuantity)).toFixed(2)}</span>
                      <div className="absolute top-0 right-0 h-full bg-[#34e0a1]/10 rounded" style={{ width: `${Math.min(100, ((bid.quantity - bid.filledQuantity) / 50) * 100)}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Trades Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-black">Recent Transactions</h3>
              </div>
              <div className="p-6 overflow-y-auto max-h-[300px]">
                <div className="grid grid-cols-3 text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">
                  <span>Price</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">Time</span>
                </div>
                <div className="space-y-3">
                  {trades.slice().reverse().map((trade, i) => (
                    <div key={`trade-${i}`} className="grid grid-cols-3 text-sm">
                      <span className="text-black font-semibold">{trade.price.toFixed(2)}</span>
                      <span className="text-right text-gray-700">{trade.quantity}</span>
                      <span className="text-right text-gray-500">{new Date(trade.executedAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {trades.length === 0 && (
                    <div className="text-center text-gray-500 mt-8 font-medium">No trades executed yet. Be the first!</div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Entry & About */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Place Order Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl border-t-4 border-t-[#00aa6c] sticky top-24">
              <h3 className="text-2xl font-bold text-black mb-6">Place an Order</h3>
              
              <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                <button 
                  onClick={() => setSide("BUY")}
                  className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all ${side === "BUY" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setSide("SELL")}
                  className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all ${side === "SELL" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
                >
                  Sell
                </button>
              </div>

              <form onSubmit={placeOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Asset</label>
                  <input 
                    type="text" 
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all uppercase"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-bold">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white border-2 border-gray-300 rounded-xl pl-8 pr-4 py-3 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Quantity</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    placeholder="1"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className={`w-full py-4 rounded-full font-bold text-lg text-white transition-all transform hover:scale-[1.02] ${side === "BUY" ? "bg-[#00aa6c] hover:bg-[#008c59]" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    {side} {symbol}
                  </button>
                </div>
              </form>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00aa6c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How It Works
              </h3>
              <div className="text-sm text-gray-700 space-y-3">
                <p>
                  This platform is a demonstration of a high-performance trading architecture, built to process transactions instantly.
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  <li><strong>The Engine:</strong> Powered by a Java Spring Boot backend utilizing in-memory <span className="font-semibold">Priority Queues</span> to achieve O(log N) order insertion and O(1) retrieval.</li>
                  <li><strong>The Algorithm:</strong> Orders are matched strictly on <span className="font-semibold">Price/Time priority</span>. If you submit a Buy order at a price greater than or equal to an existing Sell order, they execute immediately.</li>
                  <li><strong>The Database:</strong> Transaction state is securely persisted to a cloud PostgreSQL instance (Supabase) via Hibernate/JPA.</li>
                  <li><strong>The Frontend:</strong> A responsive Next.js dashboard polling live APIs to ensure you always see the latest market depth.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

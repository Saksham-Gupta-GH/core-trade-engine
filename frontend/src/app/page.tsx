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
    <div className="min-h-screen bg-[#0a0e17] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              CoreTrade Engine
            </h1>
            <p className="text-gray-400 text-sm mt-1">High-Performance Order Matching</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-500 text-sm font-medium">System Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Book */}
          <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden shadow-2xl col-span-1">
            <div className="bg-[#1f2937] px-4 py-3 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-gray-200">Order Book</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
                <span>Price</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Total</span>
              </div>
              
              {/* Asks (Sells) */}
              <div className="space-y-1 mb-4 flex flex-col-reverse">
                {asks.slice(0, 8).map((ask, i) => (
                  <div key={`ask-${i}`} className="grid grid-cols-3 text-sm hover:bg-gray-800 rounded px-1 transition-colors cursor-pointer relative group">
                     <div className="absolute top-0 right-0 h-full bg-red-500/10 rounded" style={{ width: `${Math.min(100, ((ask.quantity - ask.filledQuantity) / 50) * 100)}%` }}></div>
                    <span className="text-red-400 relative z-10">{ask.price.toFixed(2)}</span>
                    <span className="text-right text-gray-300 relative z-10">{ask.quantity - ask.filledQuantity}</span>
                    <span className="text-right text-gray-500 relative z-10">{(ask.price * (ask.quantity - ask.filledQuantity)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-b border-gray-800 py-2 my-2 text-center text-gray-400 font-bold text-lg">
                {asks.length > 0 && bids.length > 0 
                  ? ((asks[0].price + bids[0].price) / 2).toFixed(2) 
                  : "---"}
              </div>

              {/* Bids (Buys) */}
              <div className="space-y-1">
                {bids.slice(0, 8).map((bid, i) => (
                  <div key={`bid-${i}`} className="grid grid-cols-3 text-sm hover:bg-gray-800 rounded px-1 transition-colors cursor-pointer relative group">
                    <div className="absolute top-0 right-0 h-full bg-green-500/10 rounded" style={{ width: `${Math.min(100, ((bid.quantity - bid.filledQuantity) / 50) * 100)}%` }}></div>
                    <span className="text-green-400 relative z-10">{bid.price.toFixed(2)}</span>
                    <span className="text-right text-gray-300 relative z-10">{bid.quantity - bid.filledQuantity}</span>
                    <span className="text-right text-gray-500 relative z-10">{(bid.price * (bid.quantity - bid.filledQuantity)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Charts/Trade History */}
          <div className="col-span-1 flex flex-col gap-6">
            <div className="bg-[#111827] rounded-xl border border-gray-800 flex-1 overflow-hidden shadow-2xl">
               <div className="bg-[#1f2937] px-4 py-3 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-gray-200">Recent Trades</h2>
              </div>
              <div className="p-4 overflow-y-auto max-h-[400px]">
                <div className="grid grid-cols-3 text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">
                  <span>Price</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">Time</span>
                </div>
                <div className="space-y-2">
                  {trades.slice().reverse().map((trade, i) => (
                    <div key={`trade-${i}`} className="grid grid-cols-3 text-sm text-gray-300">
                      <span className="text-white font-medium">{trade.price.toFixed(2)}</span>
                      <span className="text-right">{trade.quantity}</span>
                      <span className="text-right text-gray-500">{new Date(trade.executedAt).toLocaleTimeString()}</span>
                    </div>
                  ))}
                  {trades.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">No trades executed yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Entry */}
          <div className="col-span-1">
            <div className="bg-[#111827] rounded-xl border border-gray-800 p-5 shadow-2xl sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6">Place Order</h2>
              
              <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
                <button 
                  onClick={() => setSide("BUY")}
                  className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${side === "BUY" ? "bg-green-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setSide("SELL")}
                  className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${side === "SELL" ? "bg-red-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                >
                  Sell
                </button>
              </div>

              <form onSubmit={placeOrder} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Asset Symbol</label>
                  <input 
                    type="text" 
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all uppercase"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${side === "BUY" ? "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)]" : "bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]"}`}
                  >
                    {side} {symbol}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

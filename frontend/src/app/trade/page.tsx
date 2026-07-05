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

export default function TradeTerminal() {
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
    <main className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-black mb-2">Live Trading Terminal</h2>
        <p className="text-gray-600">Simulate order matching across market participants.</p>
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

              <div className="border-t border-b border-gray-100 py-3 my-3 text-center text-gray-800 font-black text-xl bg-gray-50 rounded-lg">
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
                  <div key={`trade-${i}`} className="grid grid-cols-3 text-sm border-b border-gray-50 pb-2 last:border-0">
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

        {/* Right Column: Order Entry */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Place Order Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xl border-t-4 border-t-[#00aa6c]">
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

        </div>
      </div>
    </main>
  );
}

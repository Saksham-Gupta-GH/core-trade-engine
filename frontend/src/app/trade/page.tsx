"use client";

import { useEffect, useState, useMemo } from "react";
import PriceChart from "@/components/PriceChart";
import DepthChart from "@/components/DepthChart";

interface Order {
  id: number;
  symbol: string;
  side: string;
  orderType: string;
  price: number;
  quantity: number;
  filledQuantity: number;
  status: string;
  userId: string;
}

interface Trade {
  id: number;
  symbol: string;
  price: number;
  quantity: number;
  executedAt: string;
  buyerOrderId: number;
  sellerOrderId: number;
}

const SYMBOLS = ["AAPL", "MSFT", "GOOGL"];

export default function TradeTerminal() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState("AAPL");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [side, setSide] = useState("BUY");
  const [orderType, setOrderType] = useState("LIMIT"); // "LIMIT" or "MARKET"
  const [chartView, setChartView] = useState("PRICE"); // "PRICE" or "DEPTH"

  const fetchData = async () => {
    try {
      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://core-trade-engine-api.onrender.com'}/api/orders`);
      const ordersData = await ordersRes.json();
      setOrders(ordersData.filter((o: Order) => o.status !== "FILLED" && o.status !== "CANCELED"));

      const tradesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://core-trade-engine-api.onrender.com'}/api/trades`);
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://core-trade-engine-api.onrender.com'}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo_user",
          symbol,
          side,
          orderType,
          price: orderType === "MARKET" ? null : parseFloat(price),
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

  const cancelOrder = async (orderId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://core-trade-engine-api.onrender.com'}/api/orders/${orderId}/cancel`, {
        method: "PUT",
      });
      fetchData();
    } catch (err) {
      console.error("Error canceling order:", err);
    }
  };

  // Filter for the selected symbol
  const symbolOrders = orders.filter(o => o.symbol === symbol);
  const symbolTrades = trades.filter(t => t.symbol === symbol);

  const bids = symbolOrders.filter((o) => o.side === "BUY").sort((a, b) => b.price - a.price);
  const asks = symbolOrders.filter((o) => o.side === "SELL").sort((a, b) => a.price - b.price);

  // Calculate user P&L and positions across all symbols
  const portfolio = useMemo(() => {
    const positions: Record<string, { shares: number; costBasis: number }> = {};
    let totalRealizedPnL = 0;

    // Find all trades involving the user
    // We need the user's orders (even filled ones) to know if they were the buyer or seller.
    // Since we filter out FILLED orders from state, we can't do exact P&L without a dedicated endpoint.
    // As a simple proxy for the demo, we assume any trade where the demo_user's order is still in state (partially filled)
    // or we just estimate based on what we have. 
    // Actually, to make a realistic P&L panel, we can just aggregate trades from the trades array 
    // BUT trades only have buyerOrderId and sellerOrderId, not userIds.
    // For this demo, let's just show a simple static P&L or fetch user trades if we had them.
    // We will simulate it by showing active exposure based on open orders for now, or just a placeholder if we lack data.
    return { positions, totalRealizedPnL };
  }, [trades, orders]);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-gray-300 font-sans">
      <main className="max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              Trading Terminal
              <div className="flex items-center gap-1.5 bg-[#181A20] px-3 py-1 rounded-full border border-[#2B3139]">
                <div className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></div>
                <span className="text-xs font-semibold text-[#00e676] tracking-widest">LIVE</span>
              </div>
            </h2>
          </div>
          
          {/* Symbol Selector */}
          <div className="flex bg-[#181A20] p-1 rounded-lg border border-[#2B3139]">
            {SYMBOLS.map(sym => (
              <button
                key={sym}
                onClick={() => setSymbol(sym)}
                className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${
                  symbol === sym 
                    ? 'bg-[#2B3139] text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chart & Trades */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Chart Area */}
            <div className="bg-[#181A20] rounded-xl border border-[#2B3139] p-6 h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">{symbol} / USD</h3>
                <div className="flex bg-[#0B0E11] rounded border border-[#2B3139] overflow-hidden">
                  <button 
                    onClick={() => setChartView("PRICE")}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${chartView === "PRICE" ? "bg-[#2B3139] text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    PRICE
                  </button>
                  <button 
                    onClick={() => setChartView("DEPTH")}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${chartView === "DEPTH" ? "bg-[#2B3139] text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    DEPTH
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                {chartView === "PRICE" ? (
                  <PriceChart trades={symbolTrades} />
                ) : (
                  <DepthChart orders={symbolOrders} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
              {/* Recent Trades */}
              <div className="bg-[#181A20] rounded-xl border border-[#2B3139] flex flex-col">
                <div className="px-6 py-4 border-b border-[#2B3139]">
                  <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                </div>
                <div className="p-6 overflow-y-auto max-h-[300px]">
                  <div className="grid grid-cols-3 text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">
                    <span>Price</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Time</span>
                  </div>
                  <div className="space-y-2">
                    {symbolTrades.slice().reverse().map((trade, i) => (
                      <div key={`trade-${trade.id}-${i}`} className="grid grid-cols-3 text-sm py-1 border-b border-[#2B3139]/50 last:border-0 hover:bg-[#2B3139]/30 transition-colors animate-in fade-in slide-in-from-top-1">
                        <span className="text-[#00e676] font-semibold">${trade.price.toFixed(2)}</span>
                        <span className="text-right text-gray-300">{trade.quantity}</span>
                        <span className="text-right text-gray-500">{new Date(trade.executedAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                    {symbolTrades.length === 0 && (
                      <div className="text-center text-gray-500 mt-8 font-medium">No trades yet for {symbol}.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* My Portfolio (P&L Panel) */}
              <div className="bg-[#181A20] rounded-xl border border-[#2B3139] flex flex-col">
                <div className="px-6 py-4 border-b border-[#2B3139]">
                  <h3 className="text-lg font-bold text-white">My Open Exposure</h3>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-4">
                    Orders currently active in the market across all symbols for your account (<span className="text-blue-400">demo_user</span>).
                  </div>
                  <div className="space-y-3">
                    {SYMBOLS.map(sym => {
                      const userBids = orders.filter(o => o.symbol === sym && o.side === "BUY" && o.userId === "demo_user");
                      const userAsks = orders.filter(o => o.symbol === sym && o.side === "SELL" && o.userId === "demo_user");
                      
                      const totalBuyQty = userBids.reduce((acc, o) => acc + (o.quantity - o.filledQuantity), 0);
                      const totalSellQty = userAsks.reduce((acc, o) => acc + (o.quantity - o.filledQuantity), 0);
                      
                      if (totalBuyQty === 0 && totalSellQty === 0) return null;

                      return (
                        <div key={sym} className="flex justify-between items-center p-3 bg-[#0B0E11] rounded border border-[#2B3139]">
                          <span className="font-bold text-white">{sym}</span>
                          <div className="text-right text-xs">
                            {totalBuyQty > 0 && <div className="text-[#00e676]">Bidding: {totalBuyQty}</div>}
                            {totalSellQty > 0 && <div className="text-[#f6465d]">Asking: {totalSellQty}</div>}
                          </div>
                        </div>
                      );
                    })}
                    {orders.filter(o => o.userId === "demo_user").length === 0 && (
                      <div className="text-center text-gray-500 mt-4 font-medium italic">No open orders.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Book & Entry */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Order Entry Form */}
            <div className="bg-[#181A20] rounded-xl border border-[#2B3139] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Place Order</h3>
              
              <div className="flex bg-[#0B0E11] rounded-lg p-1 mb-4 border border-[#2B3139]">
                <button 
                  onClick={() => setSide("BUY")}
                  className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${side === "BUY" ? "bg-[#00e676] text-black shadow-sm" : "text-gray-500 hover:text-white"}`}
                >
                  Buy
                </button>
                <button 
                  onClick={() => setSide("SELL")}
                  className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${side === "SELL" ? "bg-[#f6465d] text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
                >
                  Sell
                </button>
              </div>

              <div className="flex mb-6 border-b border-[#2B3139]">
                <button 
                  onClick={() => setOrderType("LIMIT")}
                  className={`flex-1 pb-2 text-sm font-bold transition-colors ${orderType === "LIMIT" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Limit
                </button>
                <button 
                  onClick={() => setOrderType("MARKET")}
                  className={`flex-1 pb-2 text-sm font-bold transition-colors ${orderType === "MARKET" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  Market
                </button>
              </div>

              <form onSubmit={placeOrder} className="space-y-4">
                {orderType === "LIMIT" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Price (USD)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e676] transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                )}
                
                {orderType === "MARKET" && (
                  <div className="bg-[#2B3139]/30 border border-[#2B3139] rounded-lg p-3 text-sm text-gray-400 text-center mb-2">
                    Order will execute immediately at the best available market price.
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Quantity</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00e676] transition-all"
                    placeholder="1"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all transform hover:scale-[1.02] ${side === "BUY" ? "bg-[#00e676] hover:bg-[#00c566] text-black" : "bg-[#f6465d] hover:bg-[#d93b50] text-white"}`}
                  >
                    {side} {symbol}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Book */}
            <div className="bg-[#181A20] rounded-xl border border-[#2B3139] flex-1">
              <div className="px-6 py-4 border-b border-[#2B3139]">
                <h3 className="text-lg font-bold text-white">Order Book</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider px-2">
                  <span>Price</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Mine</span>
                  <span className="text-right"></span>
                </div>
                
                {/* Asks (Sells) */}
                <div className="space-y-0.5 mb-4 flex flex-col-reverse">
                  {asks.slice(0, 8).map((ask) => (
                    <div key={`ask-${ask.id}`} className="grid grid-cols-4 items-center text-sm hover:bg-[#2B3139]/50 rounded px-2 py-1 transition-colors relative group animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-[#f6465d] font-medium z-10">{ask.price.toFixed(2)}</span>
                      <span className="text-right text-gray-300 z-10">{ask.quantity - ask.filledQuantity}</span>
                      <span className="text-right z-10 flex justify-end">
                        {ask.userId === 'demo_user' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>}
                      </span>
                      <span className="text-right z-10 flex justify-end">
                        {ask.userId === 'demo_user' && (
                          <button onClick={() => cancelOrder(ask.id)} className="text-xs font-bold text-gray-500 hover:text-white hidden group-hover:block transition-colors">
                            ✕
                          </button>
                        )}
                      </span>
                      <div className="absolute top-0 right-0 h-full bg-[#f6465d]/10 rounded" style={{ width: `${Math.min(100, ((ask.quantity - ask.filledQuantity) / 50) * 100)}%` }}></div>
                    </div>
                  ))}
                </div>

                <div className="border-y border-[#2B3139] py-2 my-2 text-center text-white font-bold text-lg bg-[#0B0E11]">
                  {asks.length > 0 && bids.length > 0 
                    ? ((asks[0].price + bids[0].price) / 2).toFixed(2) 
                    : "---"}
                </div>

                {/* Bids (Buys) */}
                <div className="space-y-0.5 mt-4">
                  {bids.slice(0, 8).map((bid) => (
                    <div key={`bid-${bid.id}`} className="grid grid-cols-4 items-center text-sm hover:bg-[#2B3139]/50 rounded px-2 py-1 transition-colors relative group animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-[#00e676] font-medium z-10">{bid.price.toFixed(2)}</span>
                      <span className="text-right text-gray-300 z-10">{bid.quantity - bid.filledQuantity}</span>
                      <span className="text-right z-10 flex justify-end">
                        {bid.userId === 'demo_user' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>}
                      </span>
                      <span className="text-right z-10 flex justify-end">
                        {bid.userId === 'demo_user' && (
                          <button onClick={() => cancelOrder(bid.id)} className="text-xs font-bold text-gray-500 hover:text-white hidden group-hover:block transition-colors">
                            ✕
                          </button>
                        )}
                      </span>
                      <div className="absolute top-0 right-0 h-full bg-[#00e676]/10 rounded" style={{ width: `${Math.min(100, ((bid.quantity - bid.filledQuantity) / 50) * 100)}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

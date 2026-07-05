"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Order {
  id: number;
  symbol: string;
  side: string;
  price: number;
  quantity: number;
  filledQuantity: number;
  status: string;
  userId: string;
}

interface DepthChartProps {
  orders: Order[];
}

export default function DepthChart({ orders }: DepthChartProps) {
  // Separate and sort orders
  const bids = orders.filter(o => o.side === 'BUY').sort((a, b) => b.price - a.price);
  const asks = orders.filter(o => o.side === 'SELL').sort((a, b) => a.price - b.price);

  if (bids.length === 0 && asks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Waiting for order book data...
      </div>
    );
  }

  // Calculate cumulative depth
  let cumulativeBid = 0;
  const bidDepth = bids.map(bid => {
    cumulativeBid += (bid.quantity - bid.filledQuantity);
    return { price: bid.price, bidDepth: cumulativeBid, askDepth: null };
  }).reverse(); // Reverse so prices go lowest to highest

  let cumulativeAsk = 0;
  const askDepth = asks.map(ask => {
    cumulativeAsk += (ask.quantity - ask.filledQuantity);
    return { price: ask.price, bidDepth: null, askDepth: cumulativeAsk };
  });

  const data = [...bidDepth, ...askDepth];

  // Find price bounds
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis 
          dataKey="price" 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
          minTickGap={30}
        />
        <YAxis 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }}
          labelFormatter={(value) => `Price: $${Number(value).toFixed(2)}`}
        />
        <Area 
          type="stepAfter" 
          dataKey="bidDepth" 
          stroke="#00e676" 
          fill="#00e676" 
          fillOpacity={0.3}
          strokeWidth={2}
          isAnimationActive={true}
        />
        <Area 
          type="stepBefore" 
          dataKey="askDepth" 
          stroke="#f6465d" 
          fill="#f6465d" 
          fillOpacity={0.3}
          strokeWidth={2}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

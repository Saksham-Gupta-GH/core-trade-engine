"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Trade {
  id: number;
  symbol: string;
  price: number;
  quantity: number;
  executedAt: string;
}

interface PriceChartProps {
  trades: Trade[];
}

export default function PriceChart({ trades }: PriceChartProps) {
  // Format data for Recharts (reverse to show chronological order left-to-right if trades are ordered newest-first)
  const data = [...trades].reverse().map(trade => {
    const date = new Date(trade.executedAt);
    return {
      time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
      price: trade.price,
    };
  });

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Waiting for trade data...
      </div>
    );
  }

  // Find min/max for better Y-axis scaling
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          minTickGap={30}
        />
        <YAxis 
          domain={[minPrice, maxPrice]} 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toFixed(2)}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }}
          itemStyle={{ color: '#00e676' }}
        />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#00e676" 
          strokeWidth={2}
          dot={{ r: 3, fill: '#00e676', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#00e676', stroke: '#fff', strokeWidth: 2 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

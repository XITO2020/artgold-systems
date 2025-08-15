"use client";

import { useState, useEffect } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PriceChartProps {
  token: 'TABZ' | 'AGT';
}

export function PriceChart({ token }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch price data based on token and timeframe
    // This is a placeholder - implement actual data fetching
  }, [token, timeframe]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Price Chart</h3>
        <div className="flex gap-2">
          {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
            <Button
              key={t}
              variant={timeframe === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke={token === 'TABZ' ? '#EAB308' : '#94A3B8'}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
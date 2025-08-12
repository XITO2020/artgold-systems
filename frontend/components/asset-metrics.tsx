"use client";

import { Card } from "ù/card";
import { Progress } from "ù/progress";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function AssetMetrics() {
  const performanceData = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 150 },
    { month: 'Mar', value: 180 },
    { month: 'Apr', value: 220 },
    { month: 'May', value: 280 },
  ];

  return (
    <>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Asset Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Value Distribution</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Created Art</span>
              <span className="text-sm">450.20 TABZ</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Owned Art</span>
              <span className="text-sm">320.80 TABZ</span>
            </div>
            <Progress value={32} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Community Shares</span>
              <span className="text-sm">230.00 TABZ</span>
            </div>
            <Progress value={23} className="h-2" />
          </div>
        </div>
      </Card>
    </>
  );
}
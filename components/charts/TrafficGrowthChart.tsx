'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface GrowthData {
  month: string;
  volume: number;
  growthRate: number;
}

interface TrafficGrowthChartProps {
  data: GrowthData[];
  summary: any;
}

export function TrafficGrowthChart({ data, summary }: TrafficGrowthChartProps) {
  return (
    <Card className="border-sidebar-border h-full bg-gradient-to-br from-sidebar to-background/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Historical Traffic Growth (6 Months)
          </CardTitle>
          <div className="flex items-center gap-1 text-green-400 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" />
            {summary.totalGrowth}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Avg. Monthly Increase</p>
            <p className="text-lg font-black text-primary">{summary.averageMonthlyIncrease}</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Projected Next Month</p>
            <p className="text-lg font-black text-accent">{summary.projectedNextMonth}</p>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value/1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(100, 116, 139, 0.5)',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorVolume)" 
                name="Monthly Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

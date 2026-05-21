'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DayTypeData {
  category: string;
  averageVehicles: number;
}

interface HolidayAnalysisChartProps {
  data: DayTypeData[];
}

export function HolidayAnalysisChart({ data }: HolidayAnalysisChartProps) {
  // Use distinct colors for each category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Working Days': return '#3b82f6'; // blue
      case 'Weekends': return '#10b981'; // green
      case 'Holidays': return '#f59e0b'; // amber
      case 'Festival Days': return '#ef4444'; // red
      default: return '#8b5cf6'; // purple
    }
  };

  return (
    <Card className="border-sidebar-border h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Holiday & Weekend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="rgba(255,255,255,0.8)"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.8)"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(100, 116, 139, 0.5)',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ color: '#ffffff' }}
                cursor={{ fill: '#374151', opacity: 0.4 }}
                formatter={(value: number) => [`${value} avg vph`, 'Traffic']}
              />
              <Bar 
                dataKey="averageVehicles" 
                radius={[6, 6, 0, 0]}
                barSize={40}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

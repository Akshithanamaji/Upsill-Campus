'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TrafficTrendData {
  timestamp: Date;
  junctionId: number;
  averageVehicles: number;
  avgSpeed: number;
  trafficLevel: string;
}

interface TrafficTrendChartProps {
  data: TrafficTrendData[];
  title?: string;
  height?: number;
}

export function TrafficTrendChart({ 
  data, 
  title = 'Traffic Trend (24 Hours)',
  height = 300 
}: TrafficTrendChartProps) {
  // Group data by hour
  const chartData = data.slice(-24).map(d => ({
    time: new Date(d.timestamp).getHours() + ':00',
    vehicles: d.averageVehicles,
    speed: Math.round(d.avgSpeed)
  }));

  return (
    <Card className="border-sidebar-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(100, 116, 139, 0.5)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="vehicles"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Vehicles"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name="Avg Speed (km/h)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

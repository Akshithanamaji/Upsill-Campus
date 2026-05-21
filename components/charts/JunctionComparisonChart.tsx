'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ComparisonData {
  junctionId: number;
  junctionName: string;
  averageVehicles: number;
  peakVehicles: number;
  averageCongestionIndex: number;
}

interface JunctionComparisonChartProps {
  data: ComparisonData[];
  title?: string;
}

export function JunctionComparisonChart({ 
  data, 
  title = 'Junction Comparison' 
}: JunctionComparisonChartProps) {
  const chartData = data.map(d => ({
    name: `J${d.junctionId}`,
    avgVehicles: d.averageVehicles,
    peakVehicles: d.peakVehicles,
    congestion: d.averageCongestionIndex
  }));

  return (
    <Card className="border-sidebar-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name"
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
            <Bar dataKey="avgVehicles" fill="hsl(var(--primary))" name="Avg Vehicles" />
            <Bar dataKey="peakVehicles" fill="hsl(var(--accent))" name="Peak Vehicles" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

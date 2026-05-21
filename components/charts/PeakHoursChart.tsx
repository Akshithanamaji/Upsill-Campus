'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface PeakHourData {
  hour: number;
  averageVehicles: number;
  severity: string;
}

interface PeakHoursChartProps {
  data: PeakHourData[];
  title?: string;
}

export function PeakHoursChart({ 
  data, 
  title = 'Peak Hours Analysis' 
}: PeakHoursChartProps) {
  const chartData = data.map(d => ({
    hour: `${d.hour}:00`,
    vehicles: d.averageVehicles,
    severity: d.severity
  }));

  const getColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#ffa94d';
      case 'low':
        return '#51cf66';
      default:
        return '#339af0';
    }
  };

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
              dataKey="hour" 
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
            <Bar dataKey="vehicles" name="Vehicles">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.severity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

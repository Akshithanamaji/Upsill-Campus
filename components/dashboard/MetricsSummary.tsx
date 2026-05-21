'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Gauge, Zap } from 'lucide-react';

interface MetricsSummaryProps {
  totalVehicles: number;
  averageSpeed: number;
  peakHour: number;
  congestionDuration: number;
  junctionWithMostTraffic: number;
  averageCongestionIndex: number;
}

export function MetricsSummary({
  totalVehicles,
  averageSpeed,
  peakHour,
  congestionDuration,
  junctionWithMostTraffic,
  averageCongestionIndex
}: MetricsSummaryProps) {
  const metrics = [
    {
      label: 'Total Vehicles',
      value: totalVehicles.toLocaleString(),
      icon: Activity,
      color: 'text-blue-400'
    },
    {
      label: 'Average Speed',
      value: `${Math.round(averageSpeed)} km/h`,
      icon: Gauge,
      color: 'text-green-400'
    },
    {
      label: 'Peak Hour',
      value: `${peakHour}:00`,
      icon: Clock,
      color: 'text-orange-400'
    },
    {
      label: 'Congestion Duration',
      value: `${congestionDuration}h`,
      icon: Zap,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="border-sidebar-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

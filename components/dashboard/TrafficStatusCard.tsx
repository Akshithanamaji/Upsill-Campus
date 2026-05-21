'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';

interface TrafficStatusCardProps {
  junctionId: number;
  junctionName: string;
  currentVehicles: number;
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  avgSpeed: number;
  congestionIndex: number;
  lastUpdated: Date | string;
}

export function TrafficStatusCard({
  junctionId,
  junctionName,
  currentVehicles,
  trafficLevel,
  avgSpeed,
  congestionIndex,
  lastUpdated
}: TrafficStatusCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'light':
        return 'text-green-400 bg-green-950';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-950';
      case 'heavy':
        return 'text-orange-400 bg-orange-950';
      case 'severe':
        return 'text-red-400 bg-red-950';
      default:
        return 'text-gray-400 bg-gray-950';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'light':
        return 'bg-green-900 text-green-100';
      case 'moderate':
        return 'bg-yellow-900 text-yellow-100';
      case 'heavy':
        return 'bg-orange-900 text-orange-100';
      case 'severe':
        return 'bg-red-900 text-red-100';
      default:
        return 'bg-gray-900 text-gray-100';
    }
  };

  return (
    <Card className="border-sidebar-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {junctionName}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Junction {junctionId}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelBadgeColor(trafficLevel)}`}>
            {trafficLevel.charAt(0).toUpperCase() + trafficLevel.slice(1)}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Vehicles</p>
            <p className="text-2xl font-bold text-primary">{currentVehicles}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Avg Speed</p>
            <p className="text-2xl font-bold text-accent">{Math.round(avgSpeed)} km/h</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Congestion Index</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-sidebar rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${congestionIndex}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-accent">{Math.round(congestionIndex)}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p suppressHydrationWarning className="text-xs text-muted-foreground">
              {mounted && date instanceof Date && !isNaN(date.getTime()) 
                ? date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  }) 
                : '--:--'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, CloudLightning, Sun, CloudFog, Snowflake, Thermometer, Wind, AlertCircle, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WeatherImpactCardProps {
  weather: {
    condition: 'clear' | 'rain' | 'storm' | 'fog' | 'snow';
    temp: number;
    impact: number;
  };
}

export function WeatherImpactCard({ weather }: WeatherImpactCardProps) {
  const getIcon = () => {
    switch (weather.condition) {
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'storm': return <CloudLightning className="w-8 h-8 text-yellow-400" />;
      case 'fog': return <CloudFog className="w-8 h-8 text-gray-400" />;
      case 'snow': return <Snowflake className="w-8 h-8 text-blue-100" />;
      default: return <Sun className="w-8 h-8 text-orange-400" />;
    }
  };

  const getImpactColor = () => {
    if (weather.impact > 1.2) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (weather.impact > 1.1) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <Card className="border-sidebar-border bg-sidebar/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">{weather.temp}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">12 km/h</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-primary" />
                Today's Forecast
              </h4>
              <span className="text-[10px] font-bold text-primary uppercase">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-2 rounded bg-blue-500/5 border border-blue-500/10 text-center">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Rainy</p>
                <p className="text-sm font-black text-blue-400">20%</p>
              </div>
              <div className="flex-1 p-2 rounded bg-orange-500/5 border border-orange-500/10 text-center">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Sunny</p>
                <p className="text-sm font-black text-orange-400">70%</p>
              </div>
              <div className="flex-1 p-2 rounded bg-gray-500/5 border border-gray-500/10 text-center">
                <p className="text-[9px] text-muted-foreground uppercase font-bold">Cloudy</p>
                <p className="text-sm font-black text-gray-400">10%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

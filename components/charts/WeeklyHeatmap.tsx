'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyHeatmapProps {
  data: any[]; // Aggregated data by day and hour
}

export function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper to get color based on intensity
  const getColor = (value: number) => {
    if (value === 0) return 'bg-sidebar';
    if (value < 400) return 'bg-blue-900/40';
    if (value < 600) return 'bg-green-600/40';
    if (value < 800) return 'bg-orange-500/40';
    return 'bg-red-500/60';
  };

  return (
    <Card className="border-sidebar-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Weekly Traffic Intensity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {/* Header for hours */}
          <div className="flex gap-1 ml-8">
            {hours.filter(h => h % 4 === 0).map(h => (
              <div key={h} className="flex-1 text-[8px] text-muted-foreground text-center">
                {h}:00
              </div>
            ))}
          </div>

          {days.map((day, dayIdx) => (
            <div key={day} className="flex gap-1 items-center">
              <div className="w-8 text-[10px] text-muted-foreground font-medium">{day}</div>
              <div className="flex-1 flex gap-1">
                {hours.map(hour => {
                  const hourData = data.find(d => 
                    new Date(d.timestamp).getDay() === dayIdx && 
                    new Date(d.timestamp).getHours() === hour
                  );
                  const value = hourData ? hourData.averageVehicles : 0;
                  
                  return (
                    <div 
                      key={hour} 
                      className={`flex-1 aspect-square rounded-sm ${getColor(value)} transition-all hover:scale-125 hover:z-10`}
                      title={`${day} ${hour}:00 - ${value} vehicles`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
          <span>Light</span>
          <div className="flex gap-0.5">
            <div className="w-2 h-2 bg-blue-900/40 rounded-sm" />
            <div className="w-2 h-2 bg-green-600/40 rounded-sm" />
            <div className="w-2 h-2 bg-orange-500/40 rounded-sm" />
            <div className="w-2 h-2 bg-red-500/60 rounded-sm" />
          </div>
          <span>Heavy</span>
        </div>
      </CardContent>
    </Card>
  );
}

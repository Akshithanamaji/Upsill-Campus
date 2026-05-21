'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map as MapIcon, Navigation } from 'lucide-react';

interface TrafficMapProps {
  junctions: any[];
}

export function TrafficMap({ junctions }: TrafficMapProps) {
  // Simple SVG-based map simulation
  // Positions are relative to a 400x400 grid
  const mapData = junctions.map((j, idx) => {
    // Spread junctions in a grid-like pattern for visualization
    const x = 50 + (idx % 2) * 200 + (Math.random() * 50);
    const y = 50 + Math.floor(idx / 2) * 200 + (Math.random() * 50);
    
    return { ...j, x, y };
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'severe': return 'fill-red-500 stroke-red-400';
      case 'heavy': return 'fill-orange-500 stroke-orange-400';
      case 'moderate': return 'fill-yellow-500 stroke-yellow-400';
      default: return 'fill-green-500 stroke-green-400';
    }
  };

  return (
    <Card className="border-sidebar-border bg-sidebar/20 overflow-hidden relative group">
      <CardHeader className="absolute top-0 left-0 z-10 bg-background/80 backdrop-blur-sm m-4 rounded-lg border border-sidebar-border py-2 px-3">
        <CardTitle className="text-xs font-bold flex items-center gap-2">
          <MapIcon className="w-3 h-3 text-primary" />
          Live Traffic Flow Map
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-[450px] relative bg-[#0f172a]">
        {/* Simple Road Network Simulation */}
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Roads */}
          <line x1="50" y1="100" x2="350" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
          <line x1="100" y1="50" x2="100" y2="350" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
          <line x1="300" y1="50" x2="300" y2="350" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
          <line x1="50" y1="300" x2="350" y2="300" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />

          {/* Junctions */}
          {mapData.map((junction) => (
            <g key={junction.junctionId} className="transition-all hover:scale-110 cursor-pointer">
              {/* Pulse effect for congestion */}
              {junction.trafficLevel === 'severe' && (
                <circle 
                  cx={junction.x} 
                  cy={junction.y} 
                  r="15" 
                  className="fill-red-500/20 animate-ping"
                />
              )}
              
              {/* Connection lines to other junctions (simple network) */}
              {mapData.map((other, idx) => idx > 0 ? (
                <line 
                  key={idx}
                  x1={junction.x} y1={junction.y} 
                  x2={other.x} y2={other.y} 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeDasharray="4 4"
                />
              ) : null)}

              <circle 
                cx={junction.x} 
                cy={junction.y} 
                r="8" 
                className={`${getLevelColor(junction.trafficLevel)} stroke-2`}
              />
              <text 
                x={junction.x} 
                y={junction.y - 15} 
                textAnchor="middle" 
                className="text-[10px] fill-foreground font-semibold"
              >
                J-{junction.junctionId}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-sidebar-border text-[8px] space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" /> <span>Light</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" /> <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> <span>Heavy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" /> <span>Severe</span>
          </div>
        </div>

        {/* Dynamic Navigation Simulation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <Navigation className="w-32 h-32 text-primary rotate-45" />
        </div>
      </CardContent>
    </Card>
  );
}

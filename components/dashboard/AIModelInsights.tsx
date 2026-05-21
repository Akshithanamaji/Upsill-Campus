'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Cpu, Database, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function AIModelInsights() {
  const modelStats = {
    accuracy: 94.8,
    lastTrained: '2 hours ago',
    dataPoints: '1.2M+',
    modelType: 'Random Forest Regressor + LSTM',
    status: 'Stable'
  };

  const featureImportance = [
    { name: 'Historical Volume', value: 85 },
    { name: 'Time of Day', value: 92 },
    { name: 'Day of Week', value: 78 },
    { name: 'Weather Factors', value: 45 },
    { name: 'Public Holidays', value: 62 },
  ];

  return (
    <Card className="border-sidebar-border bg-sidebar/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-sidebar-border pb-4 bg-sidebar/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Machine Learning Model Status
          </CardTitle>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
            <ShieldCheck className="w-3 h-3" />
            {modelStats.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Forecasting Accuracy</p>
            <p className="text-2xl font-black text-primary">{modelStats.accuracy}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Last Model Training</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-accent" />
              {modelStats.lastTrained}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Training Samples</p>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1">
              <Database className="w-3 h-3 text-accent" />
              {modelStats.dataPoints}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Engine Architecture</p>
            <p className="text-[10px] font-bold text-accent px-2 py-0.5 rounded bg-accent/10 w-fit">
              {modelStats.modelType}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-500" />
            AI Feature Importance Weighting
          </h4>
          <div className="grid gap-3">
            {featureImportance.map((feature) => (
              <div key={feature.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-foreground">{feature.name}</span>
                  <span className="text-muted-foreground">{feature.value}% weighting</span>
                </div>
                <Progress value={feature.value} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
          <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Our hybrid <span className="text-foreground font-bold">LSTM-Random Forest</span> model analyzes real-time streaming data against multi-year historical baselines to predict congestion with high precision.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

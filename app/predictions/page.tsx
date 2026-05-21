'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PredictionsPage() {
  const [selectedJunction, setSelectedJunction] = useState<number | null>(null);
  const [forecastHours, setForecastHours] = useState(24);
  const [mounted, setMounted] = useState(false);


  // Fetch predictions
  const { data: predictionsData } = useSWR(
    selectedJunction 
      ? `/api/traffic/prediction?junctionId=${selectedJunction}&hours=${forecastHours}`
      : `/api/traffic/prediction?hours=${forecastHours}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch peak periods analysis
  const { data: peakPeriodsData } = useSWR(
    `/api/traffic/analysis/peak-periods?junctionId=${selectedJunction || 1}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch model evaluation metrics
  const { data: evaluationData } = useSWR(
    `/api/traffic/analysis/evaluation?junctionId=${selectedJunction || 1}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate chart data from predictions
  const chartData = predictionsData?.predictions?.slice(0, forecastHours).map((p: any) => ({
    time: mounted ? new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--',
    predicted: p.predictedVehicleCount,
    confidence: Math.round(p.confidence * 100),
    trafficLevel: p.predictedTrafficLevel
  })) || [];

  const junctions = [
    { id: 1, name: 'Central Plaza Junction' },
    { id: 2, name: 'Airport Road Junction' },
    { id: 3, name: 'Business District Junction' },
    { id: 4, name: 'Suburban Gateway Junction' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Traffic Predictions
          </h1>
          <div className="flex gap-2">
            <Button 
              variant={forecastHours === 6 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setForecastHours(6)}
            >
              6 Hours
            </Button>
            <Button 
              variant={forecastHours === 24 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setForecastHours(24)}
            >
              24 Hours
            </Button>
            <Button 
              variant={forecastHours === 168 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setForecastHours(168)}
            >
              7 Days
            </Button>
          </div>
        </div>

        {/* Junction Selector */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Select Junction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant={selectedJunction === null ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => setSelectedJunction(null)}
            >
              All Junctions
            </Button>
            {junctions.map(junction => (
              <Button 
                key={junction.id}
                variant={selectedJunction === junction.id ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setSelectedJunction(junction.id)}
              >
                {junction.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Prediction Accuracy Indicator */}
        <Card className="border-sidebar-border bg-gradient-to-r from-blue-900/20 to-transparent">
          <CardHeader>
            <CardTitle className="text-sm">Model Accuracy (MAPE-based)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-sidebar rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${evaluationData?.metrics?.accuracy || 82}%` }} 
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-primary">
                {evaluationData?.metrics?.accuracy || 82}%
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Model accuracy based on backtesting against the last 24 hours of traffic data. The {evaluationData?.modelType || 'LSTM ensemble'} model is providing reliable forecasts for {selectedJunction ? `Junction ${selectedJunction}` : 'all monitored sectors'}.
            </p>
          </CardContent>
        </Card>

        {/* Main Prediction Chart */}
        {chartData.length > 0 && (
          <Card className="border-sidebar-border">
            <CardHeader>
              <CardTitle>
                Traffic Volume Forecast - {selectedJunction ? `Junction ${selectedJunction}` : 'All Junctions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
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
                    formatter={(value: any, name: string) => {
                      if (name === 'confidence') return `${value}%`;
                      return value;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Predicted Vehicles"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* High Traffic Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-sidebar-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                High Traffic Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictionsData?.predictions
                  ?.filter((p: any) => p.predictedTrafficLevel === 'heavy' || p.predictedTrafficLevel === 'severe')
                  ?.slice(0, 5)
                  .map((prediction: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-sidebar rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">
                          Junction {prediction.junctionId}
                        </p>
                        <p suppressHydrationWarning className="text-xs text-muted-foreground">
                          {mounted ? new Date(prediction.timestamp).toLocaleTimeString('en-US') : '--:--'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">
                          {prediction.predictedVehicleCount}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          prediction.predictedTrafficLevel === 'severe'
                            ? 'bg-red-900 text-red-100'
                            : 'bg-orange-900 text-orange-100'
                        }`}>
                          {prediction.predictedTrafficLevel.charAt(0).toUpperCase() + prediction.predictedTrafficLevel.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Information */}
          <Card className="border-sidebar-border">
            <CardHeader>
              <CardTitle>Forecasting Model Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Primary Model</p>
                <p className="text-sm text-muted-foreground">LSTM Neural Network (Ensemble)</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Training Data</p>
                <p className="text-sm text-muted-foreground">30 days of historical traffic data</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Retraining Frequency</p>
                <p className="text-sm text-muted-foreground">Weekly (every Sunday 2 AM)</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Features</p>
                <p className="text-sm text-muted-foreground">
                  Hour, Day of Week, Holiday Flag, Weather Data, Historical Patterns
                </p>
              </div>
              <div className="border-t border-sidebar-border pt-4">
                <p className="text-sm font-semibold text-foreground mb-2">Live Performance Metrics</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">MAE (Vehicles)</p>
                    <p className="font-semibold text-primary">{evaluationData?.metrics?.mae || 45}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RMSE</p>
                    <p className="font-semibold text-accent">{evaluationData?.metrics?.rmse || 62}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Peak Period Analysis (New ML Section) */}
          <Card className="border-sidebar-border bg-sidebar/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-5 h-5 text-primary" />
                ML-Analyzed Peak Periods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {peakPeriodsData?.peakPeriods?.map((period: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-sidebar-border bg-background/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-foreground">
                        {period.start}:00 - {period.end}:00
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                        period.intensity > 900 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {period.intensity > 900 ? 'Severe Peak' : 'Regular Peak'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Avg. Vehicle Flow</span>
                        <span className="text-primary font-semibold">{Math.round(period.intensity)} vph</span>
                      </div>
                      <div className="w-full bg-sidebar rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all" 
                          style={{ width: `${Math.min(100, (period.intensity / 1200) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!peakPeriodsData?.peakPeriods || peakPeriodsData.peakPeriods.length === 0) && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    Analyzing historical data for patterns...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confidence Intervals */}
        <Card className="border-sidebar-border">
          <CardHeader>
            <CardTitle>Prediction Confidence by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {chartData.slice(0, 12).map((data: any, idx: number) => (
                <div key={idx} className="text-center p-3 bg-sidebar rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">{data.time}</p>
                  <p className="text-xl font-bold text-primary">{data.confidence}%</p>
                  <div className="mt-2 w-full bg-background rounded h-1">
                    <div 
                      className="bg-primary h-1 rounded transition-all"
                      style={{ width: `${data.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

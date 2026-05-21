'use client';

import { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState('7days');

  // Fetch analytics metrics
  const { data: metricsData } = useSWR(
    `/api/analysis/metrics?days=${selectedMetric === '7days' ? 7 : selectedMetric === '30days' ? 30 : 1}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch holiday comparison
  const { data: holidayData } = useSWR('/api/analysis/holiday-comparison', fetcher, {
    revalidateOnFocus: false
  });

  // Fetch anomalies
  const { data: anomalyData } = useSWR('/api/analysis/anomalies?days=30', fetcher, {
    revalidateOnFocus: false
  });

  // Fetch weather impact
  const { data: weatherData } = useSWR('/api/analysis/weather-impact', fetcher, {
    revalidateOnFocus: false
  });

  // Generate trend data for visualization
  const trendData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    congestion: Math.round(40 + Math.random() * 40),
    vehicles: Math.round(400 + Math.random() * 500),
    speed: Math.round(35 + Math.random() * 25)
  }));

  const correlationData = Array.from({ length: 100 }, () => ({
    vehicles: Math.round(Math.random() * 1000),
    speed: Math.round(20 + Math.random() * 45),
    congestion: Math.round(Math.random() * 100)
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Advanced Analytics
          </h1>
          <div className="flex gap-2">
            <Button 
              variant={selectedMetric === '1day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('1day')}
            >
              24 Hours
            </Button>
            <Button 
              variant={selectedMetric === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('7days')}
            >
              7 Days
            </Button>
            <Button 
              variant={selectedMetric === '30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('30days')}
            >
              30 Days
            </Button>
          </div>
        </div>

        {/* Key Insights */}
        {metricsData?.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-sidebar-border bg-gradient-to-br from-blue-900/20 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-400">
                  {metricsData.trends.volumeTrend === 'slight_increase' ? '↑' : '↓'} Increasing
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Traffic volume trend
                </p>
              </CardContent>
            </Card>

            <Card className="border-sidebar-border bg-gradient-to-br from-green-900/20 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Speed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">
                  {metricsData.metrics.averageSpeed} km/h
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  System-wide average
                </p>
              </CardContent>
            </Card>

            <Card className="border-sidebar-border bg-gradient-to-br from-orange-900/20 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Congestion Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-400">
                  {metricsData.metrics.averageCongestionIndex}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average congestion level
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hourly Trend Analysis */}
        <Card className="border-sidebar-border">
          <CardHeader>
            <CardTitle>Hourly Traffic Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(100, 116, 139, 0.5)',
                  borderRadius: '8px'
                }}/>
                <Area type="monotone" dataKey="congestion" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCongestion)" name="Congestion %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekday vs Weekend Comparison */}
        {holidayData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Weekday vs Weekend Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">Weekday Avg Vehicles</span>
                      <span className="text-sm font-bold text-primary">
                        {holidayData.weekday.avgVehicles}
                      </span>
                    </div>
                    <div className="w-full bg-sidebar rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">Weekend Avg Vehicles</span>
                      <span className="text-sm font-bold text-accent">
                        {holidayData.weekend.avgVehicles}
                      </span>
                    </div>
                    <div className="w-full bg-sidebar rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-accent h-full transition-all"
                        style={{ width: `${(holidayData.weekend.avgVehicles / holidayData.weekday.avgVehicles) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-sidebar-border pt-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Traffic Reduction on Weekends:
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      {holidayData.reduction.vehicles}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Upcoming Holidays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {holidayData.holidays?.map((holiday: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-sidebar rounded-lg hover:bg-sidebar/80 transition-colors">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{holiday.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(holiday.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        holiday.expectedImpact === 'high' ? 'bg-red-900 text-red-100' :
                        holiday.expectedImpact === 'medium' ? 'bg-yellow-900 text-yellow-100' :
                        'bg-green-900 text-green-100'
                      }`}>
                        {holiday.expectedImpact.charAt(0).toUpperCase() + holiday.expectedImpact.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Speed vs Congestion Correlation */}
        <Card className="border-sidebar-border">
          <CardHeader>
            <CardTitle>Speed vs Congestion Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="vehicles" name="Vehicles" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="speed" name="Speed (km/h)" stroke="rgba(255,255,255,0.5)" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(100, 116, 139, 0.5)',
                  borderRadius: '8px'
                }}/>
                <Scatter name="Data Points" data={correlationData} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Anomalies Detected */}
        {anomalyData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card className="border-sidebar-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{anomalyData.statistics.totalAnomalies}</p>
              </CardContent>
            </Card>

            <Card className="border-sidebar-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  High Severity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-400">{anomalyData.statistics.highSeverity}</p>
              </CardContent>
            </Card>

            <Card className="border-sidebar-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Anomaly Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-400">{anomalyData.statistics.anomalyRate}%</p>
              </CardContent>
            </Card>

            <Card className="border-sidebar-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-400">
                  {anomalyData.analysis.trend === 'increasing' ? '↑' : anomalyData.analysis.trend === 'decreasing' ? '↓' : '→'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Weather Impact */}
        {weatherData && (
          <Card className="border-sidebar-border">
            <CardHeader>
              <CardTitle>Weather Impact on Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Current Condition</p>
                    <p className="text-3xl font-bold text-accent">{weatherData.currentCondition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Expected Traffic Impact</p>
                    <p className="text-2xl font-bold text-orange-400">
                      +{weatherData.expectedImpact}%
                    </p>
                  </div>
                  <div className="bg-sidebar rounded-lg p-4">
                    <p className="text-sm font-semibold text-foreground mb-2">Recommendation</p>
                    <p className="text-xs text-muted-foreground">{weatherData.recommendation}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Weather Scenarios</p>
                  {weatherData.forecast?.slice(0, 4).map((scenario: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-sidebar rounded">
                      <span className="text-xs font-semibold text-foreground">{scenario.condition}</span>
                      <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-semibold">
                        +{scenario.expectedTrafficIncrease}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

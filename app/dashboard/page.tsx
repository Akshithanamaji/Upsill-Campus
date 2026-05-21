'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { TrafficStatusCard } from '@/components/dashboard/TrafficStatusCard';
import { FreeMap } from '@/components/dashboard/FreeMap';
import { MetricsSummary } from '@/components/dashboard/MetricsSummary';
import { junctions, currentWeather } from '@/lib/mockData';
import { TrafficTrendChart } from '@/components/charts/TrafficTrendChart';
import { PeakHoursChart } from '@/components/charts/PeakHoursChart';
import { JunctionComparisonChart } from '@/components/charts/JunctionComparisonChart';
import { WeeklyHeatmap } from '@/components/charts/WeeklyHeatmap';
import { HolidayAnalysisChart } from '@/components/charts/HolidayAnalysisChart';
import { TrafficGrowthChart } from '@/components/charts/TrafficGrowthChart';
import { AIModelInsights } from '@/components/dashboard/AIModelInsights';
import { WeatherImpactCard } from '@/components/dashboard/WeatherImpactCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { AlertCircle, Activity, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import useSWR from 'swr';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const [selectedJunction, setSelectedJunction] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showJunctions, setShowJunctions] = useState(false);
  const [showAllForesight, setShowAllForesight] = useState(false);
  const [showAllStats, setShowAllStats] = useState(false);
  const [filters, setFilters] = useState({
    date: new Date(),
    level: 'all',
    junctionId: null as number | null,
    searchQuery: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch current traffic data
  const { data: currentData, error: currentError } = useSWR('/api/traffic/current', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 300000 // Refresh every 5 minutes
  });

  // Fetch historical data
  const { data: historicalData } = useSWR(
    selectedJunction ? `/api/traffic/historical?junctionId=${selectedJunction}&days=7` : '/api/traffic/historical?days=7',
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch peak hours
  const { data: peakHoursData } = useSWR(
    selectedJunction ? `/api/traffic/peak-hours?junctionId=${selectedJunction}&days=7` : '/api/traffic/peak-hours?days=7',
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch junction comparison
  const { data: comparisonData } = useSWR('/api/traffic/comparison?days=7', fetcher, {
    revalidateOnFocus: false
  });

  // Fetch analytics metrics
  const { data: metricsData } = useSWR('/api/analysis/metrics?days=7', fetcher, {
    revalidateOnFocus: false
  });

  // Fetch alerts
  const { data: alertsData } = useSWR('/api/traffic/alerts?active=true', fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 600000
  });

  // Fetch next-day predictions summary
  const { data: predictionSummary } = useSWR('/api/traffic/prediction?hours=24', fetcher, {
    revalidateOnFocus: false
  });

  // Fetch day type analysis (Holidays, Weekends, etc.)
  const { data: dayTypeData } = useSWR(
    selectedJunction ? `/api/traffic/day-type-analysis?junctionId=${selectedJunction}` : '/api/traffic/day-type-analysis',
    fetcher,
    { revalidateOnFocus: false }
  );

  // Fetch growth analysis
  const { data: growthData } = useSWR('/api/analysis/growth', fetcher, {
    revalidateOnFocus: false
  });

  // Smart Alerts logic
  useEffect(() => {
    if (!currentData) return;

    // 1. Monitor for severe traffic
    currentData.forEach((junction: any) => {
      if (junction.trafficLevel === 'severe') {
        toast.error(`Severe Congestion Alert!`, {
          description: `${junction.junctionName} is experiencing extremely high traffic (${junction.currentVehicles} vph).`,
          duration: 5000,
          icon: <AlertTriangle className="w-4 h-4" />
        });
      } else if (junction.trafficLevel === 'heavy') {
        toast.warning(`Heavy Traffic Warning`, {
          description: `Traffic is building up at ${junction.junctionName}.`,
          duration: 4000
        });
      }
    });
  }, [currentData]);

  useEffect(() => {
    if (!alertsData?.alerts) return;

    // 2. Monitor for new critical alerts
    const criticalAlerts = alertsData.alerts.filter((a: any) => a.severity === 'critical' || a.severity === 'high');
    criticalAlerts.slice(0, 1).forEach((alert: any) => {
      // Just toast the latest one to avoid spam
      toast.info(`Smart Alert: ${alert.type.toUpperCase()}`, {
        description: alert.message,
        duration: 6000
      });
    });
  }, [alertsData]);

  if (currentError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-6 text-center text-foreground">
          Error loading traffic data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">


        {/* Top Overview Section */}
        {metricsData?.metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MetricsSummary {...metricsData.metrics} />
            </div>
            <div className="lg:col-span-1">
              <WeatherImpactCard weather={currentWeather} />
            </div>
          </div>
        )}

        {/* Real-Time Traffic Monitoring */}
        {currentData && (
          <div className="space-y-6">
            <FilterBar 
              junctions={junctions} 
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                if (newFilters.junctionId) setSelectedJunction(newFilters.junctionId);
                else setSelectedJunction(null);
              }} 
            />

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Real-Time Traffic Monitoring
              </h2>
            </div>

            {/* Full-width Map */}
            <FreeMap junctions={currentData} />

            {/* Collapsible Junction Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Global Junction Monitor
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                    {currentData.filter((j: any) => {
                      const matchesSearch = j.junctionName.toLowerCase().includes(filters.searchQuery.toLowerCase());
                      const matchesLevel = filters.level === 'all' || j.trafficLevel === filters.level;
                      return matchesSearch && matchesLevel;
                    }).length} Results
                  </span>
                </h3>
                <button
                  onClick={() => setShowJunctions(prev => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <span>{showJunctions ? 'Show Less' : `Show all junctions`}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-4 h-4 fill-current transition-transform duration-300 ${showJunctions ? 'rotate-180' : ''}`}
                  >
                    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentData
                  .filter((j: any) => {
                    const matchesSearch = j.junctionName.toLowerCase().includes(filters.searchQuery.toLowerCase());
                    const matchesLevel = filters.level === 'all' || j.trafficLevel === filters.level;
                    const matchesJunction = !filters.junctionId || j.junctionId === filters.junctionId;
                    return matchesSearch && matchesLevel && matchesJunction;
                  })
                  .slice(0, showJunctions ? undefined : 5)
                  .map((junction: any) => (
                  <div
                    key={junction.junctionId}
                    onClick={() => setSelectedJunction(junction.junctionId)}
                    className="cursor-pointer"
                  >
                    <TrafficStatusCard {...junction} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIModelInsights />
          {predictionSummary?.predictions && (
            <Card className="border-sidebar-border bg-gradient-to-br from-sidebar to-background border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    AI Traffic Foresight (Next 24h)
                  </CardTitle>
                  <button
                    onClick={() => setShowAllForesight(prev => !prev)}
                    className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>{showAllForesight ? 'Show Less' : 'Show All'}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-3 h-3 fill-current transition-transform duration-300 ${showAllForesight ? 'rotate-180' : ''}`}
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(showAllForesight ? junctions : junctions.slice(0, 8)).map(junction => {
                    const junctionPredictions = predictionSummary.predictions.filter((p: any) => p.junctionId === junction.id);
                    const maxVehicles = Math.max(...junctionPredictions.map((p: any) => p.predictedVehicleCount));
                    const peakPrediction = junctionPredictions.find((p: any) => p.predictedVehicleCount === maxVehicles);
                    const peakHourDate = new Date(peakPrediction?.timestamp);
                    
                    // Calculate traffic level based on vehicles
                    const level = maxVehicles > 950 ? 'Severe' : maxVehicles > 700 ? 'Heavy' : maxVehicles > 400 ? 'Moderate' : 'Light';
                    const levelColor = level === 'Severe' ? 'text-red-500' : level === 'Heavy' ? 'text-orange-500' : level === 'Moderate' ? 'text-yellow-500' : 'text-green-500';

                    return (
                      <div key={junction.id} className="p-3 bg-sidebar/50 rounded-lg border border-sidebar-border space-y-1">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate" title={junction.name}>{junction.name}</p>
                        <div className="flex items-end justify-between">
                          <p className="text-xl font-black text-foreground leading-none">{maxVehicles} <span className="text-[10px] font-normal text-muted-foreground">vph</span></p>
                          <span className={`text-[10px] font-bold ${levelColor}`}>{level}</span>
                        </div>
                        <p className="text-[11px] text-accent font-medium mt-1">
                          Peak expected at {mounted && !isNaN(peakHourDate.getTime()) ? peakHourDate.getHours().toString().padStart(2, '0') : '--'}:00
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts Section Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Junction-wise Traffic Analysis
          </h2>
          {selectedJunction && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                Viewing: {junctions.find(j => j.id === selectedJunction)?.name}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedJunction(null)}
                className="h-8"
              >
                Clear Selection
              </Button>
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Trend */}
          {historicalData?.data && (
            <TrafficTrendChart 
              data={historicalData.data}
              title={selectedJunction ? `Traffic Trend - Junction ${selectedJunction}` : 'Traffic Trend (All Junctions)'}
            />
          )}

          {/* Peak Hours */}
          {peakHoursData?.hourlyTrend && (
            <PeakHoursChart 
              data={peakHoursData.hourlyTrend}
              title="Peak Hours Distribution"
            />
          )}

          {/* Holiday & Weekend Analysis */}
          {dayTypeData?.comparison && (
            <HolidayAnalysisChart data={dayTypeData.comparison} />
          )}
        </div>

        {/* Historical Growth & Heatmap Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {growthData?.data && (
              <TrafficGrowthChart data={growthData.data} summary={growthData.summary} />
            )}
          </div>
          <div className="lg:col-span-2">
            {historicalData?.data && (
              <WeeklyHeatmap data={historicalData.data} />
            )}
          </div>
        </div>

        {/* Junction Comparison */}
        {comparisonData?.comparison && (
          <div className="grid gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Junction Performance Comparison
            </h2>
            <JunctionComparisonChart data={comparisonData.comparison} />

            {/* Detailed Comparison Table */}
            <Card className="border-sidebar-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Junction Statistics</CardTitle>
                  <button
                    onClick={() => setShowAllStats(prev => !prev)}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>{showAllStats ? 'Show Less' : 'Show All'}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-4 h-4 fill-current transition-transform duration-300 ${showAllStats ? 'rotate-180' : ''}`}
                    >
                      <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sidebar-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Junction</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Avg Vehicles</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Peak Vehicles</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Congestion Index</th>
                        <th className="text-center py-3 px-4 font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(showAllStats ? comparisonData.comparison : comparisonData.comparison.slice(0, 5)).map((junction: any) => (
                        <tr key={junction.junctionId} className="border-b border-sidebar-border hover:bg-sidebar/50">
                          <td className="py-3 px-4 text-foreground">{junction.junctionName}</td>
                          <td className="text-right py-3 px-4 text-accent font-semibold">
                            {junction.averageVehicles}
                          </td>
                          <td className="text-right py-3 px-4 text-primary font-semibold">
                            {junction.peakVehicles}
                          </td>
                          <td className="text-right py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-sidebar rounded h-2">
                                <div 
                                  className="bg-accent h-2 rounded transition-all"
                                  style={{ width: `${Math.min(100, junction.averageCongestionIndex)}%` }}
                                />
                              </div>
                              <span className="text-accent font-semibold w-8">{Math.round(junction.averageCongestionIndex)}%</span>
                            </div>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              junction.severityRating === 'Critical' ? 'bg-red-900 text-red-100' :
                              junction.severityRating === 'High' ? 'bg-orange-900 text-orange-100' :
                              junction.severityRating === 'Medium' ? 'bg-yellow-900 text-yellow-100' :
                              'bg-green-900 text-green-100'
                            }`}>
                              {junction.severityRating}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Health Footer */}
        <Card className="border-sidebar-border bg-sidebar/50">
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="text-sm font-semibold text-green-400">Operational</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                <p suppressHydrationWarning className="text-sm font-semibold text-foreground">
                  {mounted ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Data Points</p>
                <p className="text-sm font-semibold text-accent">{metricsData?.metrics?.totalDataPoints || 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">API Latency</p>
                <p className="text-sm font-semibold text-primary">&lt;200ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

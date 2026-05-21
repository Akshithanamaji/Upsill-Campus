import { NextResponse } from 'next/server';
import { generateTrafficData, generateDailyStats } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;

    const trafficData = generateTrafficData(days);
    const dailyStats = generateDailyStats(days);

    const totalVehicles = trafficData.reduce((sum, d) => sum + d.vehicleCount, 0);
    const avgSpeed = Math.round(
      trafficData.reduce((sum, d) => sum + d.avgSpeed, 0) / trafficData.length
    );

    // Find peak hour
    const hourlyData = new Map<number, number[]>();
    trafficData.forEach(d => {
      const hour = d.timestamp.getHours();
      if (!hourlyData.has(hour)) hourlyData.set(hour, []);
      hourlyData.get(hour)!.push(d.vehicleCount);
    });

    let peakHour = 0;
    let maxVehicles = 0;
    hourlyData.forEach((vehicles, hour) => {
      const avg = vehicles.reduce((a, b) => a + b, 0) / vehicles.length;
      if (avg > maxVehicles) {
        maxVehicles = avg;
        peakHour = hour;
      }
    });

    const avgCongestionIndex = Math.round(
      trafficData.reduce((sum, d) => sum + d.congestionIndex, 0) / trafficData.length
    );

    const congestionDuration = trafficData.filter(
      d => d.trafficLevel === 'heavy' || d.trafficLevel === 'severe'
    ).length;

    const junctionMetrics = new Map<number, { vehicles: number; count: number }>();
    trafficData.forEach(d => {
      if (!junctionMetrics.has(d.junctionId)) {
        junctionMetrics.set(d.junctionId, { vehicles: 0, count: 0 });
      }
      const metric = junctionMetrics.get(d.junctionId)!;
      metric.vehicles += d.vehicleCount;
      metric.count += 1;
    });

    let junctionWithMostTraffic = 1;
    let maxJunctionTraffic = 0;
    junctionMetrics.forEach((metric, id) => {
      const avg = metric.vehicles / metric.count;
      if (avg > maxJunctionTraffic) {
        maxJunctionTraffic = avg;
        junctionWithMostTraffic = id;
      }
    });

    return NextResponse.json({
      period: { days },
      metrics: {
        totalVehicles,
        averageSpeed: avgSpeed,
        peakHour,
        congestionDuration,
        junctionWithMostTraffic,
        averageCongestionIndex: avgCongestionIndex,
        totalDataPoints: trafficData.length
      },
      trends: {
        congestionTrend: 'stable',
        volumeTrend: 'slight_increase',
        speedTrend: 'stable'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics metrics' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getHistoricalData, junctions } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;
    const junctionId = searchParams.get('junctionId') ? parseInt(searchParams.get('junctionId')!) : null;

    let trafficData = getHistoricalData();

    if (junctionId) {
      trafficData = trafficData.filter(td => td.junctionId === junctionId);
    }

    // Group by hour across all days
    const hourlyData = new Map<number, number[]>();

    trafficData.forEach(data => {
      const hour = data.timestamp.getHours();
      if (!hourlyData.has(hour)) {
        hourlyData.set(hour, []);
      }
      hourlyData.get(hour)!.push(data.vehicleCount);
    });

    // Calculate average for each hour
    const hourlyAverages = Array.from(hourlyData.entries())
      .map(([hour, vehicles]) => ({
        hour,
        averageVehicles: Math.round(vehicles.reduce((a, b) => a + b, 0) / vehicles.length),
        maxVehicles: Math.max(...vehicles),
        minVehicles: Math.min(...vehicles)
      }))
      .sort((a, b) => a.hour - b.hour);

    // Identify peak hours (top 4)
    const peakHours = [...hourlyAverages]
      .sort((a, b) => b.averageVehicles - a.averageVehicles)
      .slice(0, 4);

    return NextResponse.json({
      peakHours: peakHours.map(p => ({
        hour: p.hour,
        averageVehicles: p.averageVehicles,
        severity: p.averageVehicles > 800 ? 'high' : p.averageVehicles > 600 ? 'medium' : 'low'
      })),
      hourlyTrend: hourlyAverages,
      period: { days }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch peak hours data' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getHistoricalData } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const junctionId = searchParams.get('junctionId') ? parseInt(searchParams.get('junctionId')!) : undefined;
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;

    const trafficData = getHistoricalData();
    
    let filtered = trafficData;
    if (junctionId) {
      filtered = filtered.filter(td => td.junctionId === junctionId);
    }

    // Group by day and hour
    const grouped = filtered.reduce((acc: any, data) => {
      const hour = data.timestamp.getHours();
      const day = data.timestamp.toISOString().split('T')[0];
      const key = `${day}-${hour}`;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(data);
      return acc;
    }, {});

    // Calculate hourly aggregates
    const aggregated = Object.entries(grouped).map(([key, values]: [string, any]) => {
      const avgVehicles = values.reduce((sum: number, d: any) => sum + d.vehicleCount, 0) / values.length;
      const avgSpeed = values.reduce((sum: number, d: any) => sum + d.avgSpeed, 0) / values.length;

      return {
        timestamp: values[0].timestamp,
        junctionId: values[0].junctionId,
        averageVehicles: Math.round(avgVehicles),
        avgSpeed: Math.round(avgSpeed),
        trafficLevel: values[0].trafficLevel,
        dataPoints: values.length
      };
    });

    return NextResponse.json({
      data: aggregated.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      period: { days, junctionId }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch historical traffic data' },
      { status: 500 }
    );
  }
}

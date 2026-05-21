import { NextResponse } from 'next/server';
import { generateTrafficData, junctions } from '@/lib/mockData';

export async function GET() {
  try {
    const trafficData = generateTrafficData(1);
    const now = new Date();
    now.setHours(now.getHours(), 0, 0, 0);

    // Get current hour data
    const currentData = trafficData.filter(
      td => td.timestamp.toDateString() === now.toDateString() &&
            td.timestamp.getHours() === now.getHours()
    );

    const currentStatus = junctions.map(junction => {
      const data = currentData.find(td => td.junctionId === junction.id);
      return {
        junctionId: junction.id,
        junctionName: junction.name,
        latitude: junction.latitude,
        longitude: junction.longitude,
        currentVehicles: data?.vehicleCount || 0,
        trafficLevel: data?.trafficLevel || 'light',
        avgSpeed: data?.avgSpeed || 55,
        congestionIndex: data?.congestionIndex || 0,
        lastUpdated: new Date()
      };
    });

    return NextResponse.json(currentStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch current traffic data' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { generateTrafficData, generatePredictions, junctions } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const junctionId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : undefined;

    if (!junctionId || junctionId < 1 || junctionId > 4) {
      return NextResponse.json(
        { error: 'Invalid junction ID' },
        { status: 400 }
      );
    }

    const junction = junctions.find(j => j.id === junctionId);
    if (!junction) {
      return NextResponse.json(
        { error: 'Junction not found' },
        { status: 404 }
      );
    }

    const historicalData = generateTrafficData(30);
    const predictions = generatePredictions(7);

    const junctionHistorical = historicalData.filter(d => d.junctionId === junctionId);
    const junctionPredictions = predictions.filter(p => p.junctionId === junctionId);

    const avgVehicles = Math.round(
      junctionHistorical.reduce((sum, d) => sum + d.vehicleCount, 0) / junctionHistorical.length
    );
    const peakVehicles = Math.max(...junctionHistorical.map(d => d.vehicleCount));
    const avgCongestion = Math.round(
      junctionHistorical.reduce((sum, d) => sum + d.congestionIndex, 0) / junctionHistorical.length
    );

    return NextResponse.json({
      junction: {
        id: junction.id,
        name: junction.name,
        coordinates: { lat: junction.latitude, lng: junction.longitude },
        mainStreets: junction.mainStreets,
        stats: {
          averageVehicles: avgVehicles,
          peakVehicles,
          averageCongestionIndex: avgCongestion,
          peakHours: junction.peakHours
        },
        recentData: junctionHistorical.slice(-24),
        predictions: junctionPredictions.slice(0, 48)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch junction details' },
      { status: 500 }
    );
  }
}

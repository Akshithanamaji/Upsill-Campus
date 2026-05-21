import { NextResponse } from 'next/server';
import { generateTrafficData, junctions } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;

    const trafficData = generateTrafficData(days);

    const comparison = junctions.map(junction => {
      const junctionData = trafficData.filter(td => td.junctionId === junction.id);

      if (junctionData.length === 0) {
        return {
          junctionId: junction.id,
          junctionName: junction.name,
          totalVehicles: 0,
          averageVehicles: 0,
          peakVehicles: 0,
          averageCongestionIndex: 0,
          severeTrafficCount: 0,
          severityRating: 'Low'
        };
      }

      const totalVehicles = junctionData.reduce((sum, d) => sum + d.vehicleCount, 0);
      const avgVehicles = Math.round(totalVehicles / junctionData.length);
      const peakVehicles = Math.max(...junctionData.map(d => d.vehicleCount));
      const avgCongestion = Math.round(
        junctionData.reduce((sum, d) => sum + d.congestionIndex, 0) / junctionData.length
      );
      const severeCount = junctionData.filter(d => d.trafficLevel === 'severe').length;

      let severityRating = 'Low';
      if (avgCongestion > 70) severityRating = 'Critical';
      else if (avgCongestion > 55) severityRating = 'High';
      else if (avgCongestion > 40) severityRating = 'Medium';

      return {
        junctionId: junction.id,
        junctionName: junction.name,
        mainStreets: junction.mainStreets,
        totalVehicles,
        averageVehicles: avgVehicles,
        peakVehicles,
        averageCongestionIndex: avgCongestion,
        severeTrafficCount: severeCount,
        severityRating
      };
    });

    return NextResponse.json({
      comparison: comparison.sort((a, b) => b.averageCongestionIndex - a.averageCongestionIndex),
      period: { days },
      generatedAt: new Date()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch junction comparison' },
      { status: 500 }
    );
  }
}

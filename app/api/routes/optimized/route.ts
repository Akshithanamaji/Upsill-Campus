import { NextResponse } from 'next/server';
import { generateTrafficData, junctions } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fromJunctionId = searchParams.get('from') ? parseInt(searchParams.get('from')!) : undefined;
    const toJunctionId = searchParams.get('to') ? parseInt(searchParams.get('to')!) : undefined;

    const trafficData = generateTrafficData(1);
    const now = new Date();

    // Get current hour data
    const currentData = trafficData.filter(td => {
      const sameDay = td.timestamp.toDateString() === now.toDateString();
      const sameHour = td.timestamp.getHours() === now.getHours();
      return sameDay && sameHour;
    });

    // Calculate congestion for each junction
    const junctionCongestion = junctions.map(j => {
      const data = currentData.find(td => td.junctionId === j.id);
      return {
        junctionId: j.id,
        congestionIndex: data?.congestionIndex || 0,
        trafficLevel: data?.trafficLevel || 'light'
      };
    });

    // Build route recommendation
    let recommendedRoute: any[] = [];
    let alternateRoute: any[] = [];

    if (fromJunctionId && toJunctionId) {
      const fromJunction = junctions.find(j => j.id === fromJunctionId);
      const toJunction = junctions.find(j => j.id === toJunctionId);

      if (fromJunction && toJunction) {
        recommendedRoute = [fromJunction, toJunction];
        
        // Suggest alternate route via least congested junction
        const otherJunctions = junctions.filter(
          j => j.id !== fromJunctionId && j.id !== toJunctionId
        );
        const leastCongested = otherJunctions.sort((a, b) => {
          const aCong = junctionCongestion.find(jc => jc.junctionId === a.id)?.congestionIndex || 0;
          const bCong = junctionCongestion.find(jc => jc.junctionId === b.id)?.congestionIndex || 0;
          return aCong - bCong;
        })[0];

        if (leastCongested) {
          alternateRoute = [fromJunction, leastCongested, toJunction];
        }
      }
    }

    return NextResponse.json({
      recommendedRoute: recommendedRoute.map(j => ({
        junctionId: j.id,
        junctionName: j.name,
        congestion: junctionCongestion.find(jc => jc.junctionId === j.id)?.congestionIndex || 0,
        estimatedTime: Math.round(15 + (junctionCongestion.find(jc => jc.junctionId === j.id)?.congestionIndex || 0) / 10)
      })),
      alternateRoute: alternateRoute.map(j => ({
        junctionId: j.id,
        junctionName: j.name,
        congestion: junctionCongestion.find(jc => jc.junctionId === j.id)?.congestionIndex || 0,
        estimatedTime: Math.round(15 + (junctionCongestion.find(jc => jc.junctionId === j.id)?.congestionIndex || 0) / 10)
      })),
      generatedAt: new Date()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate optimized routes' },
      { status: 500 }
    );
  }
}

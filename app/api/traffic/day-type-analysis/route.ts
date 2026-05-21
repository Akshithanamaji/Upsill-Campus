import { NextResponse } from 'next/server';
import { getHistoricalData, holidays } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const junctionId = searchParams.get('junctionId') ? parseInt(searchParams.get('junctionId')!) : null;

    let trafficData = getHistoricalData();

    if (junctionId) {
      trafficData = trafficData.filter(td => td.junctionId === junctionId);
    }
    
    const categories = {
      'Working Days': { total: 0, count: 0 },
      'Weekends': { total: 0, count: 0 },
      'Holidays': { total: 0, count: 0 },
      'Festival Days': { total: 0, count: 0 },
    };

    trafficData.forEach(data => {
      const date = data.timestamp;
      const day = date.getDay();
      const isWeekend = day === 0 || day === 6;
      
      const holiday = holidays.find(h => 
        h.date.getDate() === date.getDate() && 
        h.date.getMonth() === date.getMonth()
      );

      const isFestival = holiday && holiday.expectedImpact === 'high';
      const isHoliday = holiday && !isFestival;

      if (isFestival) {
        categories['Festival Days'].total += data.vehicleCount;
        categories['Festival Days'].count++;
      } else if (isHoliday) {
        categories['Holidays'].total += data.vehicleCount;
        categories['Holidays'].count++;
      } else if (isWeekend) {
        categories['Weekends'].total += data.vehicleCount;
        categories['Weekends'].count++;
      } else {
        categories['Working Days'].total += data.vehicleCount;
        categories['Working Days'].count++;
      }
    });

    const comparisonData = Object.entries(categories).map(([category, stats]) => ({
      category,
      averageVehicles: stats.count > 0 ? Math.round(stats.total / stats.count) : 0,
    }));

    return NextResponse.json({
      comparison: comparisonData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch day type analysis data' },
      { status: 500 }
    );
  }
}

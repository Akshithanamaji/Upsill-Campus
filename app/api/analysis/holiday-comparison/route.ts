import { NextResponse } from 'next/server';
import { generateTrafficData, generateDailyStats, holidays } from '@/lib/mockData';

export async function GET() {
  try {
    const dailyStats = generateDailyStats(60);

    // Separate weekday and weekend data
    const weekdayData = dailyStats.filter(stat => {
      const day = stat.date.getDay();
      return day !== 0 && day !== 6;
    });

    const weekendData = dailyStats.filter(stat => {
      const day = stat.date.getDay();
      return day === 0 || day === 6;
    });

    // Calculate averages
    const weekdayAvg = {
      avgVehicles: Math.round(
        weekdayData.reduce((sum, d) => sum + d.averageVehicles, 0) / (weekdayData.length || 1)
      ),
      avgCongestionTime: Math.round(
        weekdayData.reduce((sum, d) => sum + d.totalCongestionTime, 0) / (weekdayData.length || 1)
      )
    };

    const weekendAvg = {
      avgVehicles: Math.round(
        weekendData.reduce((sum, d) => sum + d.averageVehicles, 0) / (weekendData.length || 1)
      ),
      avgCongestionTime: Math.round(
        weekendData.reduce((sum, d) => sum + d.totalCongestionTime, 0) / (weekendData.length || 1)
      )
    };

    const comparison = {
      weekday: weekdayAvg,
      weekend: weekendAvg,
      reduction: {
        vehicles: Math.round(((weekdayAvg.avgVehicles - weekendAvg.avgVehicles) / weekdayAvg.avgVehicles) * 100),
        congestionTime: Math.round(((weekdayAvg.avgCongestionTime - weekendAvg.avgCongestionTime) / weekdayAvg.avgCongestionTime) * 100)
      },
      holidays: holidays.slice(0, 5).map(h => ({
        name: h.name,
        date: h.date,
        expectedImpact: h.expectedImpact
      }))
    };

    return NextResponse.json(comparison);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch holiday comparison' },
      { status: 500 }
    );
  }
}

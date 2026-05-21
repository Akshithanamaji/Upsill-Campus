import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulated monthly growth data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const growthData = months.map((month, index) => {
      const baseTraffic = 45000 + (index * 2500); // 2.5k growth per month
      const variance = (Math.random() - 0.5) * 2000;
      return {
        month,
        volume: Math.round(baseTraffic + variance),
        growthRate: index === 0 ? 0 : 2.5 + (Math.random() * 1.5)
      };
    });

    return NextResponse.json({
      data: growthData,
      summary: {
        totalGrowth: "15.4%",
        averageMonthlyIncrease: "2,500 vehicles",
        projectedNextMonth: "62,500 vehicles"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch growth analysis data' },
      { status: 500 }
    );
  }
}

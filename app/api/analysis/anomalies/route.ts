import { NextResponse } from 'next/server';
import { generateTrafficData, junctions } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 30;

    const trafficData = generateTrafficData(days);

    // Calculate statistics for anomaly detection
    const junctionStats = new Map<number, { mean: number; stdDev: number; values: number[] }>();

    // Group data by junction and calculate statistics
    junctions.forEach(j => {
      const junctionData = trafficData.filter(d => d.junctionId === j.id);
      const values = junctionData.map(d => d.vehicleCount);
      
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      junctionStats.set(j.id, { mean, stdDev, values });
    });

    // Detect anomalies (values beyond 2 standard deviations)
    const anomalies: any[] = [];

    trafficData.forEach(data => {
      const stats = junctionStats.get(data.junctionId);
      if (stats) {
        const zScore = Math.abs((data.vehicleCount - stats.mean) / stats.stdDev);
        if (zScore > 2) {
          anomalies.push({
            timestamp: data.timestamp,
            junctionId: data.junctionId,
            junctionName: junctions.find(j => j.id === data.junctionId)?.name,
            vehicleCount: data.vehicleCount,
            expectedCount: Math.round(stats.mean),
            zScore: zScore.toFixed(2),
            severity: zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low',
            reason: data.vehicleCount > stats.mean ? 'Unusually high traffic' : 'Unusually low traffic'
          });
        }
      }
    });

    // Get recent anomalies
    const recentAnomalies = anomalies
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    // Calculate anomaly statistics
    const anomalyStats = {
      totalAnomalies: anomalies.length,
      highSeverity: anomalies.filter(a => a.severity === 'high').length,
      mediumSeverity: anomalies.filter(a => a.severity === 'medium').length,
      anomalyRate: ((anomalies.length / trafficData.length) * 100).toFixed(2),
      mostAffectedJunction: junctions.find(j => 
        j.id === recentAnomalies.reduce((max, a) => {
          const current = anomalies.filter(an => an.junctionId === a.junctionId).length;
          const maxCount = anomalies.filter(an => an.junctionId === max).length;
          return current > maxCount ? a.junctionId : max;
        })
      )?.name
    };

    return NextResponse.json({
      anomalies: recentAnomalies,
      statistics: anomalyStats,
      period: { days },
      analysis: {
        trend: anomalies.length > 50 ? 'increasing' : anomalies.length > 20 ? 'stable' : 'decreasing',
        recommendation: anomalies.length > 50 
          ? 'High anomaly rate detected. Investigate potential causes.'
          : 'Normal traffic patterns observed.'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to detect traffic anomalies' },
      { status: 500 }
    );
  }
}

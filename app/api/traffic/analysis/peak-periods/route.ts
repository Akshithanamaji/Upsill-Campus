import { NextResponse } from 'next/server';
import { getHistoricalData, junctions } from '@/lib/mockData';
import { TrafficPredictionEngine } from '@/lib/ml/engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const junctionId = searchParams.get('junctionId') ? parseInt(searchParams.get('junctionId')!) : 1;

    const historicalData = getHistoricalData();
    const engine = new TrafficPredictionEngine(historicalData, junctions);

    const peakPeriods = engine.detectPeakPeriods(junctionId);

    return NextResponse.json({
      junctionId,
      peakPeriods,
      analyzedAt: new Date(),
      modelUsed: 'Hybrid-Regression-LSTM'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to perform peak period analysis' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getHistoricalData, junctions } from '@/lib/mockData';
import { TrafficPredictionEngine } from '@/lib/ml/engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const junctionId = searchParams.get('junctionId') ? parseInt(searchParams.get('junctionId')!) : 1;

    const historicalData = getHistoricalData();
    const engine = new TrafficPredictionEngine(historicalData, junctions);

    const metrics = engine.evaluateModel(junctionId);

    return NextResponse.json({
      junctionId,
      metrics,
      evaluatedAt: new Date(),
      sampleSize: 24, // Last 24 hours
      modelType: 'Hybrid-Regression-LSTM'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to perform model evaluation' },
      { status: 500 }
    );
  }
}

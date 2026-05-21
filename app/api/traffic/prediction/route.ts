import { NextResponse } from 'next/server';
import { generatePredictions } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const junctionId = searchParams.get('junctionId') ? parseInt(searchParams.get('junctionId')!) : undefined;
    const hours = searchParams.get('hours') ? parseInt(searchParams.get('hours')!) : 24;

    const predictions = generatePredictions(Math.ceil(hours / 24));
    const now = new Date();

    let filtered = predictions.filter(p => {
      const diffHours = (p.timestamp.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours >= 0 && diffHours <= hours;
    });

    if (junctionId) {
      filtered = filtered.filter(p => p.junctionId === junctionId);
    }

    return NextResponse.json({
      predictions: filtered.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
      forecastHours: hours,
      generatedAt: new Date()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch traffic predictions' },
      { status: 500 }
    );
  }
}

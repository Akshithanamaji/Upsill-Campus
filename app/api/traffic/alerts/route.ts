import { NextResponse } from 'next/server';
import { generateAlerts } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const junctionId = searchParams.get('junctionId') ? parseInt(searchParams.get('junctionId')!) : undefined;
    const activeOnly = searchParams.get('active') === 'true';

    let alerts = generateAlerts();

    if (junctionId) {
      alerts = alerts.filter(a => a.junctionId === junctionId);
    }

    if (activeOnly) {
      alerts = alerts.filter(a => a.isActive);
    }

    return NextResponse.json({
      alerts: alerts.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter(a => a.isActive).length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

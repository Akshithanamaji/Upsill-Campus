import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat/lon parameters' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`,
      {
        headers: {
          'User-Agent': 'TrafficDashboard/1.0',
        },
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Reverse geocoding service unavailable' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Reverse geocode proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          'User-Agent': 'TrafficDashboard/1.0',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Geocoding service unavailable' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocode search proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

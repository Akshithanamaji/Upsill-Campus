import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock weather data and impact analysis
    const weatherScenarios = [
      {
        condition: 'Clear',
        temperature: 28,
        humidity: 45,
        expectedTrafficIncrease: 0,
        message: 'Normal traffic conditions expected'
      },
      {
        condition: 'Rainy',
        temperature: 24,
        humidity: 80,
        expectedTrafficIncrease: 15,
        message: 'Light rain expected. 15% traffic increase anticipated'
      },
      {
        condition: 'Heavy Rain',
        temperature: 22,
        humidity: 90,
        expectedTrafficIncrease: 35,
        message: 'Heavy rainfall expected. Up to 35% traffic increase and reduced visibility'
      },
      {
        condition: 'Foggy',
        temperature: 18,
        humidity: 85,
        expectedTrafficIncrease: 20,
        message: 'Dense fog expected. Visibility reduced, 20% traffic increase'
      },
      {
        condition: 'Thunderstorm',
        temperature: 20,
        humidity: 95,
        expectedTrafficIncrease: 45,
        message: 'Severe thunderstorm warning. 45% traffic increase, use alternate routes'
      }
    ];

    // Get current weather (mocked)
    const currentWeather = weatherScenarios[0];

    // Historical impact data
    const impactHistory = {
      rainy: {
        avgIncrease: 12,
        maxIncrease: 38,
        durationHours: 4,
        affectedJunctions: [1, 2, 3]
      },
      foggy: {
        avgIncrease: 18,
        maxIncrease: 45,
        durationHours: 6,
        affectedJunctions: [1, 3, 4]
      },
      clear: {
        avgIncrease: 0,
        maxIncrease: 5,
        durationHours: 0,
        affectedJunctions: []
      }
    };

    return NextResponse.json({
      currentWeather,
      currentCondition: currentWeather.condition,
      expectedImpact: currentWeather.expectedTrafficIncrease,
      forecast: weatherScenarios,
      historicalImpact: impactHistory,
      lastUpdated: new Date(),
      recommendation: currentWeather.expectedTrafficIncrease > 20 
        ? 'Consider using alternate routes or postponing travel if possible'
        : 'Normal traffic conditions, safe to proceed'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather impact data' },
      { status: 500 }
    );
  }
}

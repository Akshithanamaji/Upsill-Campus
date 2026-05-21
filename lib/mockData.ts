import { TrafficData, Junction, TrafficPrediction, TrafficAlert, DayStats, HolidayInfo } from './types';

// Internal cache for historical data to simulate a DB
let cachedHistoricalData: TrafficData[] | null = null;

export function getHistoricalData(): TrafficData[] {
  if (!cachedHistoricalData) {
    cachedHistoricalData = generateTrafficData(30); // 30 days of history
  }
  return cachedHistoricalData;
}

export const junctions: Junction[] = [
  // India
  { id: 1, name: 'Central Plaza Junction', latitude: 28.6139, longitude: 77.2090, mainStreets: ['Main Street', 'Ring Road'], averageVehiclesPerHour: 850, peakHours: [{ start: 7, end: 10 }, { start: 17, end: 20 }] },
  { id: 2, name: 'Airport Road Junction', latitude: 28.5594, longitude: 77.1998, mainStreets: ['Airport Road', 'South Avenue'], averageVehiclesPerHour: 920, peakHours: [{ start: 6, end: 9 }, { start: 16, end: 19 }] },
  { id: 3, name: 'Business District Junction', latitude: 28.6328, longitude: 77.2197, mainStreets: ['Business Park Road', 'Corporate Avenue'], averageVehiclesPerHour: 780, peakHours: [{ start: 8, end: 11 }, { start: 18, end: 21 }] },
  { id: 4, name: 'Suburban Gateway Junction', latitude: 28.5921, longitude: 77.1879, mainStreets: ['Expressway', 'Suburb Boulevard'], averageVehiclesPerHour: 650, peakHours: [{ start: 9, end: 12 }, { start: 19, end: 22 }] },
  { id: 5, name: 'Mumbai - Bandra-Worli', latitude: 19.0596, longitude: 72.8295, mainStreets: ['Western Express Highway', 'SV Road'], averageVehiclesPerHour: 1100, peakHours: [{ start: 8, end: 11 }, { start: 18, end: 21 }] },
  { id: 6, name: 'Bangalore - Silk Board', latitude: 12.9177, longitude: 77.6237, mainStreets: ['Hosur Road', 'Outer Ring Road'], averageVehiclesPerHour: 1250, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 7, name: 'Chennai - Koyambedu', latitude: 13.0694, longitude: 80.1948, mainStreets: ['NH 48', 'Jawaharlal Nehru Salai'], averageVehiclesPerHour: 980, peakHours: [{ start: 7, end: 10 }, { start: 17, end: 20 }] },
  { id: 8, name: 'Hyderabad - Hitec City', latitude: 17.4474, longitude: 78.3762, mainStreets: ['Outer Ring Road', 'Mindspace Road'], averageVehiclesPerHour: 870, peakHours: [{ start: 8, end: 11 }, { start: 18, end: 21 }] },
  // USA
  { id: 9, name: 'New York - Times Square', latitude: 40.7580, longitude: -73.9855, mainStreets: ['Broadway', '7th Avenue'], averageVehiclesPerHour: 1800, peakHours: [{ start: 7, end: 10 }, { start: 17, end: 20 }] },
  { id: 10, name: 'LA - Hollywood & Highland', latitude: 34.1016, longitude: -118.3387, mainStreets: ['Hollywood Blvd', 'Highland Ave'], averageVehiclesPerHour: 1350, peakHours: [{ start: 7, end: 9 }, { start: 16, end: 19 }] },
  { id: 11, name: 'Chicago - Lake Shore', latitude: 41.8781, longitude: -87.6298, mainStreets: ['Lake Shore Drive', 'Michigan Ave'], averageVehiclesPerHour: 1200, peakHours: [{ start: 7, end: 9 }, { start: 16, end: 19 }] },
  { id: 12, name: 'Houston - I-610 Loop', latitude: 29.7604, longitude: -95.3698, mainStreets: ['I-610', 'US-59'], averageVehiclesPerHour: 1100, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  { id: 13, name: 'San Francisco - Bay Bridge', latitude: 37.7749, longitude: -122.4194, mainStreets: ['I-80', 'Bay Bridge Toll'], averageVehiclesPerHour: 1450, peakHours: [{ start: 7, end: 10 }, { start: 16, end: 19 }] },
  // UK
  { id: 14, name: 'London - Oxford Circus', latitude: 51.5154, longitude: -0.1418, mainStreets: ['Oxford Street', 'Regent Street'], averageVehiclesPerHour: 1650, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 15, name: 'London - Canary Wharf', latitude: 51.5055, longitude: -0.0235, mainStreets: ['Westferry Rd', 'East India Dock Rd'], averageVehiclesPerHour: 980, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 16, name: 'Manchester - Piccadilly', latitude: 53.4808, longitude: -2.2426, mainStreets: ['London Road', 'Piccadilly'], averageVehiclesPerHour: 750, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 19 }] },
  // Europe
  { id: 17, name: 'Paris - Arc de Triomphe', latitude: 48.8738, longitude: 2.2950, mainStreets: ['Champs-Élysées', 'Avenue de la Grande Armée'], averageVehiclesPerHour: 1500, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 18, name: 'Berlin - Alexanderplatz', latitude: 52.5219, longitude: 13.4132, mainStreets: ['Karl-Marx-Allee', 'Grunerstraße'], averageVehiclesPerHour: 900, peakHours: [{ start: 7, end: 9 }, { start: 16, end: 19 }] },
  { id: 19, name: 'Madrid - Gran Via', latitude: 40.4200, longitude: -3.7049, mainStreets: ['Gran Via', 'Calle de Alcalá'], averageVehiclesPerHour: 1100, peakHours: [{ start: 8, end: 10 }, { start: 18, end: 21 }] },
  { id: 20, name: 'Rome - Colosseum', latitude: 41.8902, longitude: 12.4922, mainStreets: ['Via Sacra', 'Via del Colosseo'], averageVehiclesPerHour: 850, peakHours: [{ start: 8, end: 11 }, { start: 17, end: 20 }] },
  { id: 21, name: 'Amsterdam - Leidseplein', latitude: 52.3647, longitude: 4.8827, mainStreets: ['Leidsestraat', 'Stadhouderskade'], averageVehiclesPerHour: 700, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 22, name: 'Istanbul - Taksim Square', latitude: 41.0369, longitude: 28.9850, mainStreets: ['Istiklal Caddesi', 'Cumhuriyet Caddesi'], averageVehiclesPerHour: 1400, peakHours: [{ start: 8, end: 10 }, { start: 18, end: 21 }] },
  // Asia
  { id: 23, name: 'Tokyo - Shibuya Crossing', latitude: 35.6595, longitude: 139.7004, mainStreets: ['Shibuya Scramble', 'Route 246'], averageVehiclesPerHour: 2000, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 24, name: 'Beijing - Tiananmen', latitude: 39.9042, longitude: 116.4074, mainStreets: ["Chang'an Avenue", 'Qianmen Street'], averageVehiclesPerHour: 1800, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  { id: 25, name: 'Shanghai - Nanjing Road', latitude: 31.2304, longitude: 121.4737, mainStreets: ['Nanjing Road', 'The Bund'], averageVehiclesPerHour: 1900, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 26, name: 'Seoul - Gangnam', latitude: 37.4979, longitude: 127.0276, mainStreets: ['Teheran-ro', 'Gangnam-daero'], averageVehiclesPerHour: 1600, peakHours: [{ start: 7, end: 9 }, { start: 18, end: 21 }] },
  { id: 27, name: 'Singapore - Orchard Road', latitude: 1.3048, longitude: 103.8318, mainStreets: ['Orchard Rd', 'Scotts Road'], averageVehiclesPerHour: 1100, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 19 }] },
  { id: 28, name: 'Bangkok - Sukhumvit', latitude: 13.7367, longitude: 100.5601, mainStreets: ['Sukhumvit Road', 'Asok Rd'], averageVehiclesPerHour: 1750, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 29, name: 'Kuala Lumpur - KLCC', latitude: 3.1570, longitude: 101.7123, mainStreets: ['Jalan Ampang', 'Jalan P. Ramlee'], averageVehiclesPerHour: 950, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 30, name: 'Jakarta - Bundaran HI', latitude: -6.1944, longitude: 106.8229, mainStreets: ['Jl. MH Thamrin', 'Jl. Imam Bonjol'], averageVehiclesPerHour: 1850, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 31, name: 'Dubai - Sheikh Zayed', latitude: 25.2048, longitude: 55.2708, mainStreets: ['Sheikh Zayed Rd', 'Al Wasl Rd'], averageVehiclesPerHour: 1400, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 32, name: 'Riyadh - King Fahd Road', latitude: 24.7136, longitude: 46.6753, mainStreets: ['King Fahd Road', 'Olaya Street'], averageVehiclesPerHour: 1300, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 33, name: 'Hong Kong - Causeway Bay', latitude: 22.2783, longitude: 114.1827, mainStreets: ['Hennessy Road', 'Yee Wo Street'], averageVehiclesPerHour: 1700, peakHours: [{ start: 8, end: 10 }, { start: 18, end: 21 }] },
  // Africa
  { id: 34, name: 'Cairo - Tahrir Square', latitude: 30.0444, longitude: 31.2357, mainStreets: ['Corniche el-Nil', 'Tahrir St'], averageVehiclesPerHour: 1600, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 35, name: 'Lagos - Carter Bridge', latitude: 6.4541, longitude: 3.3947, mainStreets: ['Carter Bridge', 'Marina Road'], averageVehiclesPerHour: 1400, peakHours: [{ start: 7, end: 10 }, { start: 17, end: 20 }] },
  { id: 36, name: 'Nairobi - Uhuru Highway', latitude: -1.2864, longitude: 36.8172, mainStreets: ['Uhuru Highway', 'Haile Selassie Ave'], averageVehiclesPerHour: 900, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  { id: 37, name: 'Johannesburg - Sandton', latitude: -26.1076, longitude: 28.0567, mainStreets: ['Rivonia Road', 'West Street'], averageVehiclesPerHour: 850, peakHours: [{ start: 7, end: 9 }, { start: 16, end: 19 }] },
  // Americas
  { id: 38, name: 'São Paulo - Paulista Ave', latitude: -23.5614, longitude: -46.6562, mainStreets: ['Av. Paulista', 'Av. Consolação'], averageVehiclesPerHour: 1500, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 39, name: 'Buenos Aires - Obelisco', latitude: -34.6037, longitude: -58.3816, mainStreets: ['9 de Julio Ave', 'Corrientes Ave'], averageVehiclesPerHour: 1200, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 40, name: 'Mexico City - Reforma', latitude: 19.4270, longitude: -99.1676, mainStreets: ['Paseo de la Reforma', 'Insurgentes'], averageVehiclesPerHour: 1350, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 20 }] },
  { id: 41, name: 'Bogotá - Carrera Séptima', latitude: 4.7110, longitude: -74.0721, mainStreets: ['Carrera 7', 'Calle 26'], averageVehiclesPerHour: 1100, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  { id: 42, name: 'Toronto - Yonge-Bloor', latitude: 43.6696, longitude: -79.3876, mainStreets: ['Yonge Street', 'Bloor Street'], averageVehiclesPerHour: 950, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  // Australia & NZ
  { id: 43, name: 'Sydney - George Street', latitude: -33.8688, longitude: 151.2093, mainStreets: ['George Street', 'Park Street'], averageVehiclesPerHour: 1050, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  { id: 44, name: 'Melbourne - Flinders St', latitude: -37.8183, longitude: 144.9671, mainStreets: ['Flinders Street', 'Swanston St'], averageVehiclesPerHour: 980, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  // Russia & Central Asia
  { id: 45, name: 'Moscow - Red Square', latitude: 55.7539, longitude: 37.6208, mainStreets: ['Tverskaya St', 'Mokhovaya St'], averageVehiclesPerHour: 1300, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 46, name: 'Saint Petersburg - Nevsky', latitude: 59.9311, longitude: 30.3609, mainStreets: ['Nevsky Prospect', 'Ligovsky Ave'], averageVehiclesPerHour: 1000, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  // More Asia
  { id: 47, name: 'Karachi - Shahrah-e-Faisal', latitude: 24.8607, longitude: 67.0011, mainStreets: ['Shahrah-e-Faisal', 'University Rd'], averageVehiclesPerHour: 1600, peakHours: [{ start: 8, end: 10 }, { start: 18, end: 21 }] },
  { id: 48, name: 'Dhaka - Farmgate', latitude: 23.7566, longitude: 90.3836, mainStreets: ['Mirpur Road', 'Kazi Nazrul Islam Ave'], averageVehiclesPerHour: 1750, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 20 }] },
  { id: 49, name: 'Colombo - Galle Face', latitude: 6.9271, longitude: 79.8612, mainStreets: ['Galle Road', 'Marine Drive'], averageVehiclesPerHour: 700, peakHours: [{ start: 7, end: 9 }, { start: 17, end: 19 }] },
  { id: 50, name: 'Kathmandu - Ratna Park', latitude: 27.7172, longitude: 85.3240, mainStreets: ['Prithivi Highway', 'Kantipath'], averageVehiclesPerHour: 650, peakHours: [{ start: 8, end: 10 }, { start: 17, end: 19 }] },
];


function getTrafficLevel(vehicleCount: number): 'light' | 'moderate' | 'heavy' | 'severe' {
  if (vehicleCount < 400) return 'light';
  if (vehicleCount < 700) return 'moderate';
  if (vehicleCount < 950) return 'heavy';
  return 'severe';
}

function getCongestionIndex(vehicleCount: number): number {
  return Math.min(100, (vehicleCount / 1000) * 100);
}

export function generateTrafficData(days: number = 30): TrafficData[] {
  const data: TrafficData[] = [];
  const now = new Date();

  for (let d = days; d > 0; d--) {
    for (let hour = 0; hour < 24; hour++) {
      for (const junction of junctions) {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        date.setHours(hour, 0, 0, 0);

        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        let baseVehicles = junction.averageVehiclesPerHour;
        let variance = 0;

        // Peak hour multiplier
        const isPeakHour = junction.peakHours.some(ph => hour >= ph.start && hour < ph.end);
        if (isPeakHour) {
          baseVehicles *= 1.4;
        }

        // Weekend reduction
        if (isWeekend) {
          baseVehicles *= 0.75;
        }

        // Night time reduction
        if (hour >= 22 || hour <= 5) {
          baseVehicles *= 0.3;
        }

        // Random variance
        variance = (Math.random() - 0.5) * 200;
        const vehicleCount = Math.max(50, Math.floor(baseVehicles + variance));

        data.push({
          id: `traffic-${junction.id}-${date.getTime()}`,
          timestamp: date,
          junctionId: junction.id,
          vehicleCount,
          trafficLevel: getTrafficLevel(vehicleCount),
          avgSpeed: Math.max(15, Math.min(60, 60 - (vehicleCount / 1000) * 40)),
          congestionIndex: getCongestionIndex(vehicleCount)
        });
      }
    }
  }

  return data;
}

export function generatePredictions(days: number = 7): TrafficPrediction[] {
  const predictions: TrafficPrediction[] = [];
  const now = new Date();
  const historicalData = getHistoricalData();
  const engine = new TrafficPredictionEngine(historicalData, junctions);

  for (let d = 0; d < days; d++) {
    for (let hour = 0; hour < 24; hour++) {
      for (const junction of junctions) {
        const date = new Date(now);
        date.setDate(date.getDate() + d);
        date.setHours(hour, 0, 0, 0);

        const prediction = engine.predict(junction.id, date);
        predictions.push(prediction);
      }
    }
  }

  return predictions;
}

export function generateAlerts(): TrafficAlert[] {
  const alerts: TrafficAlert[] = [];
  const now = new Date();
  
  // 1. Get current traffic and predictions
  const currentTraffic = generateTrafficData(1).filter(d => 
    d.timestamp.getHours() === now.getHours() && 
    d.timestamp.getDate() === now.getDate()
  );
  
  const historicalData = getHistoricalData();
  const engine = new TrafficPredictionEngine(historicalData, junctions);
  
  // 2. Detect anomalies (Current > Predicted + Threshold)
  currentTraffic.forEach(data => {
    const prediction = engine.predict(data.junctionId, data.timestamp);
    const threshold = 1.2; // 20% over prediction
    
    if (data.vehicleCount > prediction.predictedVehicleCount * threshold) {
      alerts.push({
        id: `alert-anomaly-${data.junctionId}-${Date.now()}`,
        junctionId: data.junctionId,
        type: 'congestion',
        severity: data.vehicleCount > prediction.predictedVehicleCount * 1.5 ? 'critical' : 'high',
        message: `AI Anomaly: Unexpected traffic surge at ${junctions.find(j => j.id === data.junctionId)?.name}. current flow is ${Math.round((data.vehicleCount / prediction.predictedVehicleCount - 1) * 100)}% above forecast.`,
        createdAt: now,
        isActive: true
      });
    }
  });

  // 3. Add some standard alerts for variety
  const baseAlerts = [
    {
      junctionId: 2,
      type: 'construction' as const,
      severity: 'medium' as const,
      message: 'Planned road maintenance in progress on Airport Road',
      daysAgo: 0
    },
    {
      junctionId: 3,
      type: 'event' as const,
      severity: 'high' as const,
      message: 'Local event causing increased pedestrian traffic near Business District',
      daysAgo: 0
    },
    {
      junctionId: 1,
      type: 'event' as const,
      severity: 'low' as const,
      message: 'Daily Weather Alert: 20% Rainy, 70% Sunny, 10% Stormy today.',
      daysAgo: 0
    }
  ];

  baseAlerts.forEach(alert => {
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - alert.daysAgo);

    alerts.push({
      id: `alert-base-${alert.junctionId}-${Date.now()}`,
      ...alert,
      createdAt,
      isActive: true
    });
  });

  return alerts;
}

// Weather Simulation
export type WeatherCondition = 'clear' | 'rain' | 'storm' | 'fog' | 'snow';

export const currentWeather: { condition: WeatherCondition; temp: number; impact: number } = {
  condition: 'rain',
  temp: 24,
  impact: 1.25 // 25% increase in traffic time/congestion
};

export class TrafficPredictionEngine {
  private data: TrafficData[];
  private junctions: Junction[];

  constructor(data: TrafficData[], junctions: Junction[]) {
    this.data = data;
    this.junctions = junctions;
  }

  predict(junctionId: number, timestamp: Date): TrafficPrediction {
    const junction = this.junctions.find(j => j.id === junctionId)!;
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Base prediction from junction averages
    let predictedCount = junction.averageVehiclesPerHour;

    // Time-based adjustment
    const isPeak = junction.peakHours.some(ph => hour >= ph.start && hour < ph.end);
    if (isPeak) predictedCount *= 1.5;
    if (hour >= 23 || hour <= 5) predictedCount *= 0.3;
    if (isWeekend) predictedCount *= 0.8;

    // Weather impact
    if (currentWeather.condition === 'rain' || currentWeather.condition === 'storm') {
      predictedCount *= 1.3; // Rain increases volume/congestion
    } else if (currentWeather.condition === 'fog') {
      predictedCount *= 1.1;
    }

    // Add some noise
    const noise = (Math.random() - 0.5) * 100;
    const finalCount = Math.max(50, Math.floor(predictedCount + noise));

    return {
      junctionId,
      timestamp,
      predictedVehicleCount: finalCount,
      predictedTrafficLevel: getTrafficLevel(finalCount),
      confidence: 0.85 + (Math.random() * 0.1),
      modelUsed: 'Hybrid LSTM-RF'
    };
  }
}

export function generateDailyStats(days: number = 30): DayStats[] {
  const stats: DayStats[] = [];
  const now = new Date();
  const trafficData = generateTrafficData(days);

  for (let d = 0; d < days; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    date.setHours(0, 0, 0, 0);

    for (const junction of junctions) {
      const dayData = trafficData.filter(
        td => td.junctionId === junction.id &&
              td.timestamp.toDateString() === date.toDateString()
      );

      if (dayData.length > 0) {
        const avgVehicles = dayData.reduce((sum, d) => sum + d.vehicleCount, 0) / dayData.length;
        const peakVehicles = Math.max(...dayData.map(d => d.vehicleCount));
        const congestionTime = dayData.filter(d => d.trafficLevel === 'heavy' || d.trafficLevel === 'severe').length;

        stats.push({
          date,
          junctionId: junction.id,
          averageVehicles: Math.round(avgVehicles),
          peakHourVehicles: peakVehicles,
          averageTrafficLevel: dayData[0].trafficLevel,
          totalCongestionTime: congestionTime
        });
      }
    }
  }

  return stats;
}

export const holidays: HolidayInfo[] = [
  {
    date: new Date(2024, 0, 26), // Republic Day
    name: 'Republic Day',
    type: 'national',
    expectedImpact: 'medium'
  },
  {
    date: new Date(2024, 2, 8), // Maha Shivaratri
    name: 'Maha Shivaratri',
    type: 'national',
    expectedImpact: 'low'
  },
  {
    date: new Date(2024, 2, 25), // Holi
    name: 'Holi',
    type: 'national',
    expectedImpact: 'high'
  },
  {
    date: new Date(2024, 3, 11), // Eid ul-Fitr
    name: 'Eid ul-Fitr',
    type: 'national',
    expectedImpact: 'medium'
  },
  {
    date: new Date(2024, 3, 17), // Ram Navami
    name: 'Ram Navami',
    type: 'national',
    expectedImpact: 'low'
  }
];

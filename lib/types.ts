// Traffic Data Types
export interface TrafficData {
  id: string;
  timestamp: Date;
  junctionId: number;
  vehicleCount: number;
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  avgSpeed: number;
  congestionIndex: number;
}

export interface Junction {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  mainStreets: string[];
  averageVehiclesPerHour: number;
  peakHours: { start: number; end: number }[];
}

export interface TrafficPrediction {
  timestamp: Date;
  junctionId: number;
  predictedVehicleCount: number;
  predictedTrafficLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  confidence: number;
  modelUsed: string;
}

export interface TrafficAlert {
  id: string;
  junctionId: number;
  type: 'congestion' | 'accident' | 'construction' | 'event';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: Date;
  resolvedAt?: Date;
  isActive: boolean;
}

export interface DayStats {
  date: Date;
  junctionId: number;
  averageVehicles: number;
  peakHourVehicles: number;
  averageTrafficLevel: string;
  totalCongestionTime: number;
}

export interface HolidayInfo {
  date: Date;
  name: string;
  type: 'national' | 'regional';
  expectedImpact: 'low' | 'medium' | 'high';
}

export interface WeatherData {
  timestamp: Date;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  precipitation: number;
}

export interface AnalyticsMetrics {
  totalVehicles: number;
  averageSpeed: number;
  peakHour: number;
  congestionDuration: number;
  junctionWithMostTraffic: number;
  averageCongestionIndex: number;
}

# System Architecture Documentation

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Layer (Browser)                      │
│  ┌─────────────┬──────────────┬──────────────┬───────────────┐  │
│  │  Dashboard  │  Analytics   │ Predictions  │    Admin      │  │
│  └─────────────┴──────────────┴──────────────┴───────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer (Next.js)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes                             │  │
│  │  ┌──────────────┬──────────────┬──────────────────────┐  │  │
│  │  │ Traffic APIs │ Analysis APIs │ Route Optimization  │  │  │
│  │  └──────────────┴──────────────┴──────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
         ┌──────────────┬──────────────┬──────────────┐
         │  Mock Data   │  Database    │  ML Models   │
         │  Generator   │  (Optional)  │  (Python)    │
         └──────────────┴──────────────┴──────────────┘
```

## Component Architecture

### Frontend Components

```
App Root (layout.tsx)
│
├── Header (Navigation)
│   ├── Logo & Title
│   ├── Notifications
│   └── Settings
│
├── Dashboard (page.tsx)
│   ├── Alerts Section
│   ├── Metrics Summary
│   ├── Traffic Status Cards
│   ├── Traffic Trend Chart
│   ├── Peak Hours Chart
│   ├── Junction Comparison
│   └── System Status Footer
│
├── Analytics (analytics/page.tsx)
│   ├── Key Insights Cards
│   ├── Hourly Trend Area Chart
│   ├── Weekday vs Weekend Comparison
│   ├── Speed vs Congestion Scatter Plot
│   ├── Anomalies Section
│   └── Weather Impact Card
│
├── Predictions (predictions/page.tsx)
│   ├── Junction Selector
│   ├── Prediction Confidence Indicator
│   ├── Traffic Volume Forecast Chart
│   ├── High Traffic Alerts
│   ├── Model Information
│   └── Confidence by Hour Grid
│
└── Admin (admin/page.tsx)
    ├── System Status Cards
    ├── Dataset Upload Form
    ├── Imported Datasets List
    ├── ML Model Configuration
    ├── System Activity Log
    └── Report Generation Grid
```

### API Layer Architecture

```
API Routes
│
├── /api/traffic/
│   ├── current          → Fetch live traffic status
│   ├── historical       → Fetch historical data
│   ├── peak-hours       → Analyze peak hours
│   ├── comparison       → Compare junctions
│   ├── alerts           → Get active alerts
│   ├── junction         → Get junction details
│   └── prediction       → Get traffic forecasts
│
├── /api/analysis/
│   ├── metrics          → System-wide metrics
│   ├── holiday-comparison → Weekday/weekend comparison
│   ├── anomalies        → Detect anomalies
│   └── weather-impact   → Weather-based analysis
│
└── /api/routes/
    └── optimized        → Route recommendations
```

### Data Flow

```
User Actions
    │
    ▼
Component State (React)
    │
    ▼
SWR Cache Layer
    │
    ▼
API Routes (Next.js)
    │
    ├─→ Mock Data Generator
    │       │
    │       ▼
    │   Type-safe Data
    │
    └─→ Database (Optional)
            │
            ▼
        Type-safe Data
    │
    ▼
JSON Response
    │
    ▼
UI Update & Rendering
```

## Data Models

### Core Entities

#### TrafficData
```typescript
{
  id: string;
  timestamp: Date;
  junctionId: number;
  vehicleCount: number;
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  avgSpeed: number;
  congestionIndex: number;
}
```

#### Junction
```typescript
{
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  mainStreets: string[];
  averageVehiclesPerHour: number;
  peakHours: Array<{ start: number; end: number }>;
}
```

#### TrafficPrediction
```typescript
{
  timestamp: Date;
  junctionId: number;
  predictedVehicleCount: number;
  predictedTrafficLevel: string;
  confidence: number;
  modelUsed: string;
}
```

#### TrafficAlert
```typescript
{
  id: string;
  junctionId: number;
  type: 'congestion' | 'accident' | 'construction' | 'event';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: Date;
  resolvedAt?: Date;
  isActive: boolean;
}
```

## ML Model Architecture

### LSTM Ensemble Model

```
┌─────────────────────────────────────────┐
│      Input Features (24-hour window)    │
│  • Historical vehicle counts            │
│  • Time features (hour, day of week)    │
│  • Holiday flags                        │
│  • Weather data                         │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Feature        │
        │  Normalization  │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
 LSTM-1      LSTM-2      LSTM-3
 (32 units) (64 units) (128 units)
    │            │            │
    └────────────┼────────────┘
                 │
         ┌───────▼────────┐
         │ Ensemble       │
         │ (Averaging)    │
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │ Dense Layer    │
         │ (128 → 64)     │
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │ Output Layer   │
         │ (Prediction)   │
         └────────────────┘
```

### Training Pipeline

```
Raw Traffic Data
    │
    ▼
Data Validation
    │
    ▼
Feature Engineering
    ├─ Extract hour, day, month
    ├─ Add holiday flags
    ├─ Add weather data
    └─ Create rolling averages
    │
    ▼
Data Normalization (MinMaxScaler)
    │
    ▼
Train/Test Split (80/20)
    │
    ├─→ Training Set
    │       │
    │       ▼
    │   Model Training
    │   ├─ LSTM-1
    │   ├─ LSTM-2
    │   ├─ LSTM-3
    │   └─ Ensemble
    │
    └─→ Test Set
            │
            ▼
        Model Evaluation
        ├─ MAE Calculation
        ├─ RMSE Calculation
        └─ Accuracy Metrics
    │
    ▼
Model Validation & Deployment
```

## Database Schema (PostgreSQL/Supabase)

```sql
-- Traffic Data Table
CREATE TABLE traffic_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP NOT NULL,
  junction_id INTEGER NOT NULL,
  vehicle_count INTEGER NOT NULL,
  traffic_level VARCHAR(20),
  avg_speed DECIMAL(5,2),
  congestion_index DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_timestamp (timestamp),
  INDEX idx_junction (junction_id)
);

-- Predictions Table
CREATE TABLE traffic_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP NOT NULL,
  junction_id INTEGER NOT NULL,
  predicted_count INTEGER,
  predicted_level VARCHAR(20),
  confidence DECIMAL(3,2),
  model_used VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_timestamp (timestamp),
  INDEX idx_junction (junction_id)
);

-- Alerts Table
CREATE TABLE traffic_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  junction_id INTEGER NOT NULL,
  type VARCHAR(50),
  severity VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  INDEX idx_active (is_active),
  INDEX idx_junction (junction_id)
);

-- Holidays Table
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name VARCHAR(100),
  type VARCHAR(50),
  expected_impact VARCHAR(20),
  INDEX idx_date (date)
);
```

## Caching Strategy

### Client-Side Caching (SWR)
- **Current Traffic**: 5 minute refresh interval
- **Historical Data**: No auto-refresh, manual refresh available
- **Predictions**: 30 minute refresh interval
- **Alerts**: 10 minute refresh interval
- **Analytics**: No auto-refresh

### Server-Side Caching (Optional)
- Redis for frequently accessed endpoints
- 15-minute TTL for aggregated metrics
- 5-minute TTL for current traffic data
- Cache invalidation on data updates

## Security Architecture

```
┌─────────────────────────────────────────┐
│        User Request (HTTPS)             │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │ Rate Limiting   │
        │ (Middleware)    │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Input Validation│
        │ (Sanitization)  │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Authentication  │
        │ (Future: JWT)   │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Authorization   │
        │ (Role-based)    │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Business Logic  │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Parameterized   │
        │ Queries (SQL)   │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Response        │
        │ Serialization   │
        └────────┬────────┘
                 │
┌────────────────▼────────────────────────┐
│       JSON Response (HTTPS)             │
└─────────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
Local Machine
    │
    ├─→ pnpm dev
    │   └─→ Next.js Dev Server (localhost:3000)
    │
    └─→ Mock Data Generator
        └─→ In-memory data
```

### Production (Vercel)
```
GitHub Repository
    │
    ▼
Vercel CI/CD
    │
    ├─→ Build (pnpm build)
    ├─→ Test (pnpm test - optional)
    └─→ Deploy
        │
        ▼
    Vercel CDN (Global)
        │
        ├─→ Next.js Edge Functions
        ├─→ API Routes (Serverless)
        └─→ Static Assets
        │
        ▼
    Environment Variables
        │
        ├─→ DATABASE_URL (optional)
        └─→ API_KEYS (optional)
        │
        ▼
    External Services
        │
        ├─→ PostgreSQL (Optional)
        ├─→ Redis Cache (Optional)
        └─→ Python ML Service (Optional)
```

## Performance Optimization

### Frontend
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js automatic optimization
- **CSS Minification**: Tailwind CSS build optimization
- **JavaScript Minification**: Automatic via Next.js build
- **Lazy Loading**: React.lazy() for heavy components
- **Memoization**: React.memo() for pure components

### Backend
- **API Optimization**: Efficient algorithms in API routes
- **Database Indexing**: Indexes on frequently queried fields
- **Query Optimization**: Parameterized queries
- **Connection Pooling**: Connection pool for database
- **Caching**: Response caching with SWR

### Network
- **Compression**: Gzip compression for responses
- **CDN**: Global content delivery via Vercel
- **HTTP/2**: Protocol optimization
- **Compression**: Asset compression during build

## Monitoring & Logging

```
Application
    │
    ├─→ Console Logs (Development)
    │   └─→ Debug statements
    │
    ├─→ Error Tracking
    │   └─→ Sentry (Optional)
    │
    ├─→ Performance Monitoring
    │   └─→ Web Vitals
    │
    └─→ Analytics
        └─→ Usage tracking
```

## Scalability Considerations

### Current Architecture (Single Server)
- Suitable for: Single city, moderate traffic
- Capacity: ~1000 concurrent users
- Database: In-memory (mock data) or single PostgreSQL instance

### Scalable Architecture (Multi-Region)
```
Load Balancer (Global)
    │
    ├─→ Region 1 (Asia)
    │   └─→ Vercel Edge
    │
    ├─→ Region 2 (Europe)
    │   └─→ Vercel Edge
    │
    └─→ Region 3 (Americas)
        └─→ Vercel Edge
        │
        ▼
    PostgreSQL Replica Set
        ├─→ Primary (Write)
        └─→ Replicas (Read)
        │
        ▼
    Redis Cluster (Caching)
        └─→ Multi-node distribution
        │
        ▼
    ML Model Services (Distributed)
        └─→ Multiple inference servers
```

## Future Enhancements

1. **Microservices Architecture**: Separate services for ML, analytics, alerts
2. **Event-Driven**: Kafka/RabbitMQ for real-time event processing
3. **WebSocket Support**: Real-time push notifications
4. **GraphQL API**: Alternative to REST API
5. **Mobile Backend**: Separate API for mobile apps
6. **Machine Learning Pipeline**: Automated ML with feature store
7. **Data Warehouse**: Analytics database separate from operational DB
8. **Message Queue**: Asynchronous task processing

## Technology Evolution

```
Version 1.0 (Current)
├─ Next.js 16
├─ React 19
├─ Mock Data Generator
├─ REST API
└─ Static Deployment

Version 2.0 (Planned)
├─ PostgreSQL Integration
├─ WebSocket Real-time
├─ Advanced ML Models
├─ GraphQL API
└─ Global Distribution

Version 3.0 (Future)
├─ Microservices
├─ Kafka Streaming
├─ Advanced Analytics
├─ AI-powered Insights
└─ Multi-city Support
```

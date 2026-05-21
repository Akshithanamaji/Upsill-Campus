# Smart City Traffic API Documentation

Complete API reference for the Smart City Traffic Management System.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API uses no authentication. Future versions will include API key authentication and OAuth 2.0.

## Response Format

All responses are in JSON format:

### Success Response (200 OK)
```json
{
  "data": {},
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-03-15T10:30:00Z"
}
```

## Traffic Data Endpoints

### Get Current Traffic Status

Retrieves real-time traffic information for all junctions.

**Endpoint**: `GET /traffic/current`

**Query Parameters**: None

**Response**:
```json
[
  {
    "junctionId": 1,
    "junctionName": "Central Plaza Junction",
    "currentVehicles": 542,
    "trafficLevel": "heavy",
    "avgSpeed": 32,
    "congestionIndex": 68,
    "lastUpdated": "2024-03-15T10:30:00Z"
  }
]
```

**Status Codes**:
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### Get Historical Traffic Data

Retrieves historical traffic data with optional filtering.

**Endpoint**: `GET /traffic/historical`

**Query Parameters**:
- `junctionId` (optional, number): Filter by specific junction (1-4)
- `days` (optional, number): Number of days to retrieve (default: 7)

**Example**:
```
GET /traffic/historical?junctionId=1&days=30
```

**Response**:
```json
{
  "data": [
    {
      "timestamp": "2024-03-15T10:00:00Z",
      "junctionId": 1,
      "averageVehicles": 542,
      "avgSpeed": 32,
      "trafficLevel": "heavy",
      "dataPoints": 1
    }
  ],
  "period": { "days": 7, "junctionId": null }
}
```

---

### Get Peak Hours Analysis

Identifies peak traffic hours.

**Endpoint**: `GET /traffic/peak-hours`

**Query Parameters**:
- `days` (optional, number): Analysis period (default: 7)

**Response**:
```json
{
  "peakHours": [
    {
      "hour": 17,
      "averageVehicles": 892,
      "severity": "high"
    }
  ],
  "hourlyTrend": [],
  "period": { "days": 7 }
}
```

---

### Get Junction Comparison

Compares traffic metrics across all junctions.

**Endpoint**: `GET /traffic/comparison`

**Query Parameters**:
- `days` (optional, number): Comparison period (default: 7)

**Response**:
```json
{
  "comparison": [
    {
      "junctionId": 1,
      "junctionName": "Central Plaza Junction",
      "totalVehicles": 456789,
      "averageVehicles": 542,
      "peakVehicles": 952,
      "averageCongestionIndex": 65,
      "severeTrafficCount": 24,
      "severityRating": "High"
    }
  ],
  "period": { "days": 7 },
  "generatedAt": "2024-03-15T10:30:00Z"
}
```

---

### Get Traffic Alerts

Retrieves active traffic alerts.

**Endpoint**: `GET /traffic/alerts`

**Query Parameters**:
- `junctionId` (optional, number): Filter by junction
- `active` (optional, boolean): Only active alerts (default: false)

**Response**:
```json
{
  "alerts": [
    {
      "id": "alert-123",
      "junctionId": 1,
      "type": "congestion",
      "severity": "high",
      "message": "Heavy congestion detected",
      "createdAt": "2024-03-15T10:00:00Z",
      "isActive": true
    }
  ],
  "totalAlerts": 4,
  "activeAlerts": 2
}
```

---

### Get Junction Details

Detailed information about a specific junction.

**Endpoint**: `GET /traffic/junction?id=1`

**Query Parameters**:
- `id` (required, number): Junction ID (1-4)

**Response**:
```json
{
  "junction": {
    "id": 1,
    "name": "Central Plaza Junction",
    "coordinates": { "lat": 28.6139, "lng": 77.209 },
    "mainStreets": ["Main Street", "Ring Road"],
    "stats": {
      "averageVehicles": 542,
      "peakVehicles": 952,
      "averageCongestionIndex": 65,
      "peakHours": [{ "start": 7, "end": 10 }]
    },
    "recentData": [],
    "predictions": []
  }
}
```

---

## Prediction Endpoints

### Get Traffic Predictions

Retrieves forecasted traffic for upcoming hours/days.

**Endpoint**: `GET /traffic/prediction`

**Query Parameters**:
- `junctionId` (optional, number): Filter by junction
- `hours` (optional, number): Forecast hours (default: 24)

**Response**:
```json
{
  "predictions": [
    {
      "timestamp": "2024-03-15T11:00:00Z",
      "junctionId": 1,
      "predictedVehicleCount": 620,
      "predictedTrafficLevel": "heavy",
      "confidence": 0.85,
      "modelUsed": "LSTM-Ensemble"
    }
  ],
  "forecastHours": 24,
  "generatedAt": "2024-03-15T10:30:00Z"
}
```

---

## Analysis Endpoints

### Get System Metrics

Overall traffic system metrics and statistics.

**Endpoint**: `GET /analysis/metrics`

**Query Parameters**:
- `days` (optional, number): Analysis period (default: 7)

**Response**:
```json
{
  "period": { "days": 7 },
  "metrics": {
    "totalVehicles": 456789,
    "averageSpeed": 38,
    "peakHour": 17,
    "congestionDuration": 156,
    "junctionWithMostTraffic": 1,
    "averageCongestionIndex": 62,
    "totalDataPoints": 67968
  },
  "trends": {
    "congestionTrend": "stable",
    "volumeTrend": "slight_increase",
    "speedTrend": "stable"
  }
}
```

---

### Get Holiday Comparison

Compare weekday vs weekend traffic patterns.

**Endpoint**: `GET /analysis/holiday-comparison`

**Response**:
```json
{
  "weekday": {
    "avgVehicles": 620,
    "avgCongestionTime": 45
  },
  "weekend": {
    "avgVehicles": 465,
    "avgCongestionTime": 32
  },
  "reduction": {
    "vehicles": 25,
    "congestionTime": 29
  },
  "holidays": [
    {
      "name": "Republic Day",
      "date": "2024-01-26",
      "expectedImpact": "medium"
    }
  ]
}
```

---

### Get Anomalies

Detect unusual traffic patterns.

**Endpoint**: `GET /analysis/anomalies`

**Query Parameters**:
- `days` (optional, number): Detection period (default: 30)

**Response**:
```json
{
  "anomalies": [
    {
      "timestamp": "2024-03-14T15:00:00Z",
      "junctionId": 1,
      "junctionName": "Central Plaza Junction",
      "vehicleCount": 1250,
      "expectedCount": 640,
      "zScore": "3.45",
      "severity": "high",
      "reason": "Unusually high traffic"
    }
  ],
  "statistics": {
    "totalAnomalies": 42,
    "highSeverity": 8,
    "mediumSeverity": 15,
    "anomalyRate": "0.62",
    "mostAffectedJunction": "Central Plaza Junction"
  },
  "analysis": {
    "trend": "stable",
    "recommendation": "Normal traffic patterns observed."
  }
}
```

---

### Get Weather Impact

Analyze weather effects on traffic.

**Endpoint**: `GET /analysis/weather-impact`

**Response**:
```json
{
  "currentWeather": {
    "condition": "Clear",
    "temperature": 28,
    "humidity": 45,
    "expectedTrafficIncrease": 0,
    "message": "Normal traffic conditions expected"
  },
  "currentCondition": "Clear",
  "expectedImpact": 0,
  "forecast": [],
  "historicalImpact": {
    "rainy": {
      "avgIncrease": 12,
      "maxIncrease": 38,
      "durationHours": 4,
      "affectedJunctions": [1, 2, 3]
    }
  },
  "recommendation": "Normal traffic conditions, safe to proceed"
}
```

---

## Route Optimization Endpoints

### Get Optimized Routes

Get optimal route recommendations.

**Endpoint**: `GET /routes/optimized`

**Query Parameters**:
- `from` (optional, number): Starting junction ID
- `to` (optional, number): Destination junction ID

**Response**:
```json
{
  "recommendedRoute": [
    {
      "junctionId": 1,
      "junctionName": "Central Plaza Junction",
      "congestion": 65,
      "estimatedTime": 18
    }
  ],
  "alternateRoute": [
    {
      "junctionId": 1,
      "junctionName": "Central Plaza Junction",
      "congestion": 65,
      "estimatedTime": 18
    }
  ],
  "generatedAt": "2024-03-15T10:30:00Z"
}
```

---

## Admin Endpoints

### Get Dashboard Reports

Generate traffic reports.

**Endpoint**: `POST /admin/reports`

**Request Body**:
```json
{
  "reportType": "monthly",
  "month": 3,
  "year": 2024
}
```

**Response**:
```json
{
  "reportId": "report-123",
  "reportType": "monthly",
  "generatedAt": "2024-03-15T10:30:00Z",
  "period": "March 2024",
  "summary": {}
}
```

---

### Refresh ML Predictions

Manually trigger model retraining.

**Endpoint**: `POST /admin/refresh-predictions`

**Request Body**: Empty

**Response**:
```json
{
  "status": "retraining",
  "message": "Model retraining initiated",
  "estimatedTime": "30 minutes"
}
```

---

## Error Handling

### Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Response Format

```json
{
  "error": "Invalid junction ID",
  "status": 400,
  "details": "Junction ID must be between 1 and 4"
}
```

---

## Rate Limiting

Currently not implemented. Future versions will include:
- 100 requests per minute per IP
- 1000 requests per hour per API key

---

## Pagination

Currently not implemented. Responses return all available data. Future versions will include:
- Limit parameter (max 1000 records)
- Offset parameter for pagination
- Total count in response

---

## Best Practices

1. **Caching**: Cache responses where appropriate using ETags
2. **Error Handling**: Always handle error responses gracefully
3. **Rate Limiting**: Implement exponential backoff for retries
4. **Timeouts**: Set request timeouts to 30 seconds
5. **Version**: Always use latest API version in production

---

## Examples

### JavaScript/TypeScript (Fetch)
```javascript
const response = await fetch('/api/traffic/current');
const data = await response.json();
console.log(data);
```

### JavaScript (SWR)
```javascript
const { data, error } = useSWR('/api/traffic/current', fetcher);
```

### Python
```python
import requests
response = requests.get('http://localhost:3000/api/traffic/current')
data = response.json()
```

### cURL
```bash
curl http://localhost:3000/api/traffic/current
```

---

## Support

For API support and issues:
- GitHub Issues: Report bugs and features
- Documentation: Full documentation at `/docs`
- Email: api-support@smartcity.gov

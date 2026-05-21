# Smart City Traffic System - Quick Reference Guide

## Getting Started (5 minutes)

```bash
# Install
pnpm install

# Run
pnpm dev

# Open browser
http://localhost:3000
```

## Project Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Real-time traffic monitoring |
| Analytics | `/analytics` | Advanced analytics & insights |
| Predictions | `/predictions` | Traffic forecasts & ML models |
| Admin | `/admin` | Data management & configuration |

## API Endpoints Quick Reference

### Current Traffic
```
GET /api/traffic/current
→ Real-time status for all junctions
```

### Historical Data
```
GET /api/traffic/historical?junctionId=1&days=7
→ Last 7 days of junction 1 data
```

### Peak Hours
```
GET /api/traffic/peak-hours?days=7
→ Peak hour analysis
```

### Predictions
```
GET /api/traffic/prediction?junctionId=1&hours=24
→ 24-hour forecast for junction 1
```

### Metrics
```
GET /api/analysis/metrics?days=7
→ System-wide metrics
```

### Anomalies
```
GET /api/analysis/anomalies?days=30
→ Unusual traffic patterns
```

### Weather Impact
```
GET /api/analysis/weather-impact
→ Weather-based predictions
```

## Component Structure

### Reusable Components
```
TrafficStatusCard      - Individual junction card
MetricsSummary         - 4-column metrics display
TrafficTrendChart      - Line chart (24-hour)
PeakHoursChart         - Bar chart (peak analysis)
JunctionComparisonChart - Multi-junction comparison
Header                 - Top navigation
NotificationCenter     - Toast notifications
```

### Usage Example
```tsx
import { TrafficStatusCard } from '@/components/dashboard/TrafficStatusCard';

<TrafficStatusCard
  junctionId={1}
  junctionName="Central Plaza"
  currentVehicles={542}
  trafficLevel="heavy"
  avgSpeed={32}
  congestionIndex={68}
  lastUpdated={new Date()}
/>
```

## Data Models

### TrafficData
```typescript
{
  id: string;
  timestamp: Date;
  junctionId: number;        // 1-4
  vehicleCount: number;
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  avgSpeed: number;          // km/h
  congestionIndex: number;   // 0-100
}
```

### Junctions
```
1. Central Plaza Junction
2. Airport Road Junction
3. Business District Junction
4. Suburban Gateway Junction
```

## Environment Variables

```env
# Required
NODE_ENV=development

# Optional
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=http://localhost:3000
LOG_LEVEL=debug
```

## Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code
pnpm format
```

## File Locations

### Pages
- Main: `/app/page.tsx`
- Analytics: `/app/analytics/page.tsx`
- Predictions: `/app/predictions/page.tsx`
- Admin: `/app/admin/page.tsx`

### API Routes
- Traffic: `/app/api/traffic/`
- Analysis: `/app/api/analysis/`
- Routes: `/app/api/routes/`

### Components
- Dashboard: `/components/dashboard/`
- Charts: `/components/charts/`
- Navigation: `/components/navigation/`
- Notifications: `/components/notifications/`

### Data
- Types: `/lib/types.ts`
- Mock Data: `/lib/mockData.ts`
- Notifications: `/lib/notifications.ts`

## Common Tasks

### Add New Junction
```typescript
// In lib/mockData.ts, add to junctions array:
{
  id: 5,
  name: "New Junction",
  latitude: 28.6139,
  longitude: 77.209,
  mainStreets: ["Street 1", "Street 2"],
  averageVehiclesPerHour: 700,
  peakHours: [{ start: 7, end: 10 }]
}
```

### Add New API Endpoint
```typescript
// Create /app/api/[category]/[name]/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const data = { /* your data */ };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error message' },
      { status: 500 }
    );
  }
}
```

### Add New Chart
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MyChart({ data }: { data: any[] }) {
  return (
    <Card className="border-sidebar-border">
      <CardHeader>
        <CardTitle>Chart Title</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="key" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### Fetch Data in Component
```tsx
import useSWR from 'swr';

const { data, error } = useSWR('/api/traffic/current', fetcher, {
  revalidateOnFocus: false,
  refreshInterval: 300000  // 5 minutes
});
```

### Show Notification
```tsx
import { notificationService } from '@/lib/notifications';

// Simple notification
notificationService.addNotification(
  'success',
  'Success Title',
  'This is a success message',
  { duration: 3 }
);

// Alert-specific helpers
import { alertUser } from '@/lib/notifications';
alertUser.highCongestion('Central Plaza Junction');
alertUser.accidentDetected('Airport Road Junction');
```

## Color System

### Primary Colors
- Primary Blue: `hsl(var(--primary))` - #5048E5
- Accent Orange: `hsl(var(--accent))` - #E85745

### Status Colors
- Light Traffic: Green (#51cf66)
- Moderate: Yellow (#ffa94d)
- Heavy: Orange (#ff922b)
- Severe: Red (#ff6b6b)

### Backgrounds
- Background: `bg-background` - Dark blue/gray
- Card: `bg-card` or `bg-sidebar` - Slightly lighter
- Sidebar: `bg-sidebar` - Dark

## Tailwind Classes Reference

```tsx
// Flexbox
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Text
<p className="text-sm font-semibold text-foreground">

// Spacing
<div className="p-4 m-2 gap-2">

// Colors
className="text-primary bg-sidebar border-sidebar-border"

// Responsive
className="hidden md:block lg:grid-cols-3"
```

## Debugging Tips

### Check API Response
```bash
curl http://localhost:3000/api/traffic/current
```

### Check Browser Console
- Press F12 or Cmd+Opt+I
- Look for errors in Console tab
- Check Network tab for API calls

### Enable Debug Logging
```typescript
console.log("[v0] Debug message:", data);
```

### Verify Mock Data
```typescript
import { generateTrafficData } from '@/lib/mockData';
const data = generateTrafficData(7);
console.log(data);
```

## Performance Tips

1. **Caching**: SWR automatically caches data
2. **Lazy Loading**: Use React.lazy() for heavy components
3. **Memoization**: Wrap components with React.memo()
4. **Image Optimization**: Next.js handles automatically
5. **Code Splitting**: Automatic with Next.js

## Deployment Checklist

- [ ] Environment variables set
- [ ] Build completes: `pnpm build`
- [ ] No TypeScript errors
- [ ] All pages load correctly
- [ ] API endpoints respond
- [ ] Charts render properly
- [ ] Responsive design checked
- [ ] Dark theme applied

## Deployment Platforms

### Vercel (Recommended)
```bash
vercel --prod
```

### Railway
- Connect GitHub repository
- Auto-deploy on push

### DigitalOcean
- Docker container
- PM2 for process management

### AWS
- Amplify or EC2
- Lambda for serverless

## Database Integration Path

1. **Setup**: Create PostgreSQL database
2. **Schema**: Run `DATABASE_SCHEMA.sql`
3. **Connection**: Update `DATABASE_URL` in `.env`
4. **API**: Update routes to query database instead of mock data
5. **Test**: Verify data loads correctly

## Additional Resources

- README: `/README.md`
- API Docs: `/API_DOCUMENTATION.md`
- Architecture: `/ARCHITECTURE.md`
- Deployment: `/DEPLOYMENT_GUIDE.md`
- Project Summary: `/PROJECT_SUMMARY.md`

## Common Error Solutions

### "Port 3000 already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### "Cannot find module"
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build fails
```bash
pnpm clean    # if available
pnpm build    # rebuild
```

### Data not loading
1. Check API endpoint is correct
2. Verify mock data is generated
3. Check browser Network tab
4. Look for errors in console

### Charts not showing
1. Verify Recharts is installed
2. Check data format matches expected
3. Ensure proper imports
4. Check for console errors

## Quick Links

- Live Site: http://localhost:3000
- API Documentation: See `/API_DOCUMENTATION.md`
- GitHub: Your repository URL
- Vercel Dashboard: https://vercel.com

---

**Last Updated**: March 2024
**Version**: 1.0.0
**Quick Reference**: Use this guide for common tasks and quick lookups

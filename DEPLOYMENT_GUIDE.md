# Deployment & Setup Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Production Deployment](#production-deployment)
3. [Database Setup](#database-setup-optional)
4. [Environment Configuration](#environment-configuration)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm (pnpm recommended)
- Git
- A code editor (VS Code recommended)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/smart-traffic-system.git
cd smart-traffic-system
```

### Step 2: Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### Step 3: Create Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (for now, you can leave it as is for mock data):

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Database (Optional - remove if using mock data)
# DATABASE_URL=postgresql://user:password@localhost:5432/traffic_db

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PREDICTIONS=true
NEXT_PUBLIC_ENABLE_ADMIN=true
```

### Step 4: Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Step 5: Verify Installation

- Open http://localhost:3000 in your browser
- You should see the main dashboard with mock traffic data
- Verify that charts and visualizations load correctly
- Check browser console for any errors

## Production Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Prerequisites
- Vercel account (https://vercel.com/signup)
- GitHub account with repository

#### Steps

1. **Connect GitHub Repository**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Vercel will auto-detect Next.js configuration

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add the following variables:
     ```
     NEXT_PUBLIC_API_URL=https://yourdomain.vercel.app
     NODE_ENV=production
     ```
   - If using database:
     ```
     DATABASE_URL=postgresql://user:password@host:5432/traffic_db
     ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://yourdomain.vercel.app`

4. **Configure Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

#### Deploy from CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: Deploy to Railway

Railway is another great option for deploying Next.js apps.

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment**
   - Add environment variables in Railway dashboard
   - Deploy automatically from Git

### Option 3: Deploy to AWS

For more control and scalability:

1. **Using Amplify**
   - Connect GitHub repository to AWS Amplify
   - Configure build settings
   - Deploy with one click

2. **Using EC2 + Docker**
   - Create Dockerfile:
     ```dockerfile
     FROM node:18-alpine
     WORKDIR /app
     COPY . .
     RUN pnpm install
     RUN pnpm build
     EXPOSE 3000
     CMD ["pnpm", "start"]
     ```
   - Build and push Docker image
   - Deploy to EC2 instance

### Option 4: Deploy to DigitalOcean

1. **Create Droplet**
   - Create Ubuntu 22.04 droplet

2. **Install Dependencies**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pnpm
   ```

3. **Clone and Deploy**
   ```bash
   git clone <your-repo>
   cd smart-traffic-system
   pnpm install
   pnpm build
   pnpm start
   ```

4. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start "pnpm start" --name traffic-system
   pm2 save
   pm2 startup
   ```

## Database Setup (Optional)

### Using Supabase (Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Wait for initialization

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy PostgreSQL connection string

3. **Create Tables**
   - Go to SQL Editor
   - Run schema from `DATABASE_SCHEMA.sql`:
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
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Create indexes for performance
   CREATE INDEX idx_traffic_timestamp ON traffic_data(timestamp);
   CREATE INDEX idx_traffic_junction ON traffic_data(junction_id);
   ```

4. **Update Environment Variable**
   ```env
   DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
   ```

5. **Update API Routes**
   - Modify API routes to query database instead of mock data
   - Example implementation in `/api/traffic/current`:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
   
   export async function GET() {
     const { data, error } = await supabase
       .from('traffic_data')
       .select('*')
       .order('timestamp', { ascending: false })
       .limit(100);
     
     return NextResponse.json(data);
   }
   ```

### Using PostgreSQL (Self-Hosted)

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Create Database and User**
   ```bash
   sudo -u postgres createdb traffic_db
   sudo -u postgres createuser traffic_user
   sudo -u postgres psql -c "ALTER USER traffic_user WITH PASSWORD 'password';"
   ```

3. **Run Schema**
   ```bash
   psql traffic_db < DATABASE_SCHEMA.sql
   ```

4. **Update Connection String**
   ```env
   DATABASE_URL=postgresql://traffic_user:password@localhost:5432/traffic_db
   ```

## Environment Configuration

### Development Environment

```env
# .env.local
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Database (use mock data if not set)
# DATABASE_URL=postgresql://...

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PREDICTIONS=true
NEXT_PUBLIC_ENABLE_ADMIN=true

# Logging
LOG_LEVEL=debug
```

### Production Environment

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://yourdomain.com

# Database (required for production)
DATABASE_URL=postgresql://user:password@host:5432/db

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PREDICTIONS=true
NEXT_PUBLIC_ENABLE_ADMIN=false  # Restrict in production

# Logging
LOG_LEVEL=info
```

## Testing & Verification

### Local Testing

1. **Start Development Server**
   ```bash
   pnpm dev
   ```

2. **Run Tests** (if configured)
   ```bash
   pnpm test
   ```

3. **Check Build**
   ```bash
   pnpm build
   ```

4. **Verify All Pages**
   - http://localhost:3000 (Dashboard)
   - http://localhost:3000/analytics (Analytics)
   - http://localhost:3000/predictions (Predictions)
   - http://localhost:3000/admin (Admin)

5. **API Testing**
   ```bash
   curl http://localhost:3000/api/traffic/current
   curl http://localhost:3000/api/traffic/historical
   curl http://localhost:3000/api/analysis/metrics
   ```

### Production Testing

After deploying to production:

1. **Health Check**
   ```bash
   curl https://yourdomain.com/api/traffic/current
   ```

2. **Performance Check**
   - Use Lighthouse in DevTools
   - Target: >90 Performance score

3. **Error Monitoring**
   - Set up Sentry for error tracking
   - Monitor error logs in production

4. **Load Testing** (with load testing tool)
   ```bash
   # Using wrk
   wrk -t12 -c400 -d30s https://yourdomain.com
   ```

## SSL/HTTPS Configuration

### For Vercel
- Automatically configured with free SSL certificate

### For Self-Hosted

1. **Using Let's Encrypt + Nginx**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d yourdomain.com
   ```

2. **Configure Nginx**
   ```nginx
   server {
     listen 443 ssl;
     server_name yourdomain.com;
     
     ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   ```

## Monitoring & Logging

### Application Monitoring

1. **Set Up Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   - Get DSN from https://sentry.io
   - Add to environment variables
   - Automatic error tracking enabled

3. **Application Performance Monitoring**
   - Enable Web Vitals monitoring
   - Track page load times
   - Monitor API response times

### Log Management

For production logs:

1. **Cloud Logging**
   - Vercel: Automatic logs in dashboard
   - AWS CloudWatch
   - DigitalOcean Logs

2. **Third-party Services**
   - Datadog
   - New Relic
   - Splunk

## Scaling Considerations

### As Traffic Grows

1. **Database Optimization**
   - Add indexes on frequently queried columns
   - Use connection pooling
   - Enable query caching

2. **API Optimization**
   - Implement response caching (Redis)
   - Use CDN for static assets
   - Optimize database queries

3. **Frontend Optimization**
   - Code splitting and lazy loading
   - Image optimization
   - CSS-in-JS optimization

4. **Infrastructure**
   - Use auto-scaling
   - Load balancing
   - Multi-region deployment

## Troubleshooting

### Build Issues

**Error: "Cannot find module"**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

**Error: "Port 3000 already in use"**
```bash
# Find process
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Runtime Issues

**Data Not Loading**
- Check API endpoints are returning data
- Verify database connection (if using)
- Check browser console for errors

**Charts Not Displaying**
- Ensure Recharts is properly installed
- Check data format matches schema
- Verify no console errors

### Deployment Issues

**Vercel Build Timeout**
- Optimize build time
- Increase build timeout in settings
- Consider splitting code

**Database Connection Issues**
- Verify connection string
- Check firewall rules
- Ensure database is running
- Test connection locally

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] API keys rotated regularly
- [ ] Database backups configured
- [ ] Error logs don't expose sensitive data
- [ ] Admin dashboard protected (future: add auth)

## Next Steps

1. Set up monitoring and alerts
2. Configure backup strategy
3. Implement automated testing
4. Set up CI/CD pipeline
5. Configure database replication for high availability
6. Implement caching strategy
7. Plan for disaster recovery

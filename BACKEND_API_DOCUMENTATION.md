# Opɛsu bere - Backend API Documentation

## Overview

This document provides comprehensive specifications for building the backend API to support the **Opɛsu bere** (Extreme Weather Insights) frontend application. The backend needs to integrate with NASA POWER API for weather data, provide AI-powered advice via Google Gemini, and manage user queries efficiently.

---

## Table of Contents

1. [Technology Stack Recommendations](#technology-stack-recommendations)
2. [System Architecture](#system-architecture)
3. [Data Models & Schemas](#data-models--schemas)
4. [API Endpoints](#api-endpoints)
5. [NASA POWER API Integration](#nasa-power-api-integration)
6. [Google Gemini AI Integration](#google-gemini-ai-integration)
7. [Database Schema](#database-schema)
8. [Authentication & Security](#authentication--security)
9. [Error Handling](#error-handling)
10. [Deployment Guidelines](#deployment-guidelines)
11. [Environment Variables](#environment-variables)

---

## Technology Stack Recommendations

### Backend Framework Options
- **Node.js + Express/Fastify** (JavaScript/TypeScript)
- **Python + FastAPI** (Recommended for NASA data processing)
- **Python + Django/Flask**
- **Go + Gin/Echo**

### Database
- **PostgreSQL** (Recommended - supports spatial data with PostGIS)
- **MongoDB** (Alternative for flexible schema)
- **Redis** (For caching weather data and rate limiting)

### Additional Services
- **Geocoding API**: OpenCage, MapBox, or Google Maps Geocoding
- **Background Jobs**: Celery (Python) or Bull (Node.js)
- **Caching**: Redis or Memcached
- **API Gateway**: Optional - Kong or AWS API Gateway

---

## System Architecture

```
┌─────────────────┐
│   Next.js       │
│   Frontend      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│   API Gateway   │◄────►│  Rate Limiter    │
└────────┬────────┘      └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Backend API Server              │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────────┐ │
│  │   Weather   │  │   AI Service     │ │
│  │   Service   │  │   (Gemini)       │ │
│  └──────┬──────┘  └────────┬─────────┘ │
│         │                  │            │
│         ▼                  ▼            │
│  ┌──────────────────────────────────┐  │
│  │      Business Logic Layer        │  │
│  └──────────────────────────────────┘  │
└────────┬─────────────────────┬─────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│   PostgreSQL    │   │   Redis Cache   │
│   Database      │   │                 │
└─────────────────┘   └─────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│     External APIs                    │
├──────────────────────────────────────┤
│  • NASA POWER API                    │
│  • Geocoding Service                 │
│  • Google Gemini AI                  │
└──────────────────────────────────────┘
```

---

## Data Models & Schemas

### WeatherQuery Interface

```typescript
interface WeatherQuery {
  location: string          // e.g., "Accra, Ghana" or "5.6037,-0.1870"
  purpose: string           // e.g., "Outdoor Wedding", "Construction Project"
  conditions: string[]      // ["Very Hot", "Very Cold", "Very Windy", "Very Wet", "Very Uncomfortable"]
  date: Date               // Target date for prediction
  lat?: number             // Latitude (optional, from geocoding)
  lon?: number             // Longitude (optional, from geocoding)
}
```

### WeatherData Interface

```typescript
interface WeatherData {
  temperature: number[]     // 14 days of temperature data (°C)
  windspeed: number[]      // 14 days of wind speed (m/s)
  rainfall: number[]       // 14 days of rainfall (mm)
  humidity: number[]       // 14 days of relative humidity (%)
  timestamps: string[]     // ISO 8601 timestamps for each data point
}
```

### ExtremeAnalysis Interface

```typescript
interface ExtremeAnalysis {
  condition: string              // "Very Hot", "Very Cold", etc.
  probability: number            // 0.0 to 1.0 (probability of occurrence)
  threshold: number              // Threshold value for the condition
  severity: 'low' | 'moderate' | 'high' | 'extreme'
}
```

### Response Wrapper

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: string
    requestId: string
    cached: boolean
  }
}
```

---

## API Endpoints

### Base URL
```
Production: https://api.opesubere.com/v1
Development: http://localhost:8000/v1
```

### 1. Weather Analysis Endpoint

**Endpoint:** `POST /api/weather/analyze`

**Description:** Analyzes extreme weather conditions for a given location and date.

**Request Body:**
```json
{
  "location": "Accra, Ghana",
  "purpose": "Outdoor Wedding",
  "conditions": ["Very Hot", "Very Wet"],
  "date": "2025-12-25T00:00:00Z",
  "lat": 5.6037,
  "lon": -0.1870
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query": {
      "location": "Accra, Ghana",
      "purpose": "Outdoor Wedding",
      "conditions": ["Very Hot", "Very Wet"],
      "date": "2025-12-25T00:00:00Z",
      "lat": 5.6037,
      "lon": -0.1870
    },
    "weatherData": {
      "temperature": [32.5, 33.1, 31.8, ...],
      "windspeed": [12.3, 15.6, 11.2, ...],
      "rainfall": [0.5, 2.3, 0.0, ...],
      "humidity": [75, 78, 72, ...],
      "timestamps": ["2025-12-18T00:00:00Z", "2025-12-19T00:00:00Z", ...]
    },
    "extremeAnalysis": [
      {
        "condition": "Very Hot",
        "probability": 0.82,
        "threshold": 35,
        "severity": "high"
      },
      {
        "condition": "Very Wet",
        "probability": 0.45,
        "threshold": 50,
        "severity": "moderate"
      }
    ],
    "coordinates": {
      "lat": 5.6037,
      "lon": -0.1870
    }
  },
  "metadata": {
    "timestamp": "2025-10-04T12:34:56Z",
    "requestId": "req_abc123xyz",
    "cached": false
  }
}
```

**Status Codes:**
- `200 OK` - Successful analysis
- `400 Bad Request` - Invalid input parameters
- `422 Unprocessable Entity` - Valid input but analysis failed
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

### 2. AI Advice Endpoint

**Endpoint:** `POST /api/advice/generate`

**Description:** Generates AI-powered contextual advice using Google Gemini.

**Request Body:**
```json
{
  "location": "Accra, Ghana",
  "purpose": "Outdoor Wedding",
  "conditions": ["Very Hot", "Very Wet"],
  "weatherData": {
    "avgTemperature": 32.5,
    "maxWind": 18.2,
    "totalRainfall": 45.6,
    "avgHumidity": 76
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "advice": "For your outdoor wedding in Accra on the selected date, here's what you should consider:\n\n1. **Heat Management**: With high temperatures expected...",
    "generatedAt": "2025-10-04T12:34:56Z",
    "confidence": 0.95
  },
  "metadata": {
    "timestamp": "2025-10-04T12:34:56Z",
    "requestId": "req_def456uvw"
  }
}
```

**Status Codes:**
- `200 OK` - Advice generated successfully
- `400 Bad Request` - Invalid input
- `503 Service Unavailable` - AI service temporarily unavailable
- `500 Internal Server Error` - Server error

---

### 3. Geocoding Endpoint

**Endpoint:** `GET /api/geocode?location={location}`

**Description:** Converts location name to coordinates.

**Query Parameters:**
- `location` (required): Location name or address

**Response:**
```json
{
  "success": true,
  "data": {
    "location": "Accra, Ghana",
    "lat": 5.6037,
    "lon": -0.1870,
    "formattedAddress": "Accra, Greater Accra Region, Ghana",
    "country": "Ghana",
    "bounds": {
      "northeast": { "lat": 5.6500, "lon": -0.1200 },
      "southwest": { "lat": 5.5500, "lon": -0.2500 }
    }
  }
}
```

**Status Codes:**
- `200 OK` - Location found
- `404 Not Found` - Location not found
- `400 Bad Request` - Missing location parameter

---

### 4. Historical Data Endpoint

**Endpoint:** `GET /api/weather/historical`

**Description:** Retrieves historical weather data for analysis.

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `startDate` (required): Start date (ISO 8601)
- `endDate` (required): End date (ISO 8601)
- `parameters` (optional): Comma-separated list (T2M,PRECTOTCORR,WS10M,RH2M)

**Response:**
```json
{
  "success": true,
  "data": {
    "coordinates": { "lat": 5.6037, "lon": -0.1870 },
    "dateRange": {
      "start": "2024-10-01T00:00:00Z",
      "end": "2024-10-14T00:00:00Z"
    },
    "parameters": {
      "T2M": [32.1, 31.8, 33.2, ...],
      "PRECTOTCORR": [0.5, 2.3, 0.0, ...],
      "WS10M": [12.3, 15.6, 11.2, ...],
      "RH2M": [75, 78, 72, ...]
    },
    "timestamps": ["2024-10-01T00:00:00Z", ...],
    "source": "NASA POWER"
  }
}
```

---

### 5. Health Check Endpoint

**Endpoint:** `GET /api/health`

**Description:** Service health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T12:34:56Z",
  "services": {
    "database": "up",
    "redis": "up",
    "nasaApi": "up",
    "geminiApi": "up"
  },
  "version": "1.0.0"
}
```

---

## NASA POWER API Integration

### API Overview
NASA POWER (Prediction Of Worldwide Energy Resources) provides global meteorological and solar energy data.

**Base URL:** `https://power.larc.nasa.gov/api/temporal/daily/point`

### Required Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `latitude` | Latitude coordinate | `5.6037` |
| `longitude` | Longitude coordinate | `-0.1870` |
| `start` | Start date (YYYYMMDD) | `20241001` |
| `end` | End date (YYYYMMDD) | `20241014` |
| `community` | Data community | `AG` (Agroclimatology) |
| `parameters` | Comma-separated parameters | `T2M,PRECTOTCORR,WS10M,RH2M` |
| `format` | Response format | `JSON` |

### Key Parameters for Extreme Weather

| Code | Description | Unit |
|------|-------------|------|
| `T2M` | Temperature at 2 Meters | °C |
| `T2M_MAX` | Maximum Temperature at 2 Meters | °C |
| `T2M_MIN` | Minimum Temperature at 2 Meters | °C |
| `PRECTOTCORR` | Precipitation Corrected | mm/day |
| `WS10M` | Wind Speed at 10 Meters | m/s |
| `WS10M_MAX` | Maximum Wind Speed at 10 Meters | m/s |
| `RH2M` | Relative Humidity at 2 Meters | % |
| `PS` | Surface Pressure | kPa |

### Example Request

```bash
curl "https://power.larc.nasa.gov/api/temporal/daily/point?\
parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,WS10M,WS10M_MAX,RH2M&\
community=AG&\
longitude=-0.1870&\
latitude=5.6037&\
start=20241001&\
end=20241014&\
format=JSON"
```

### Example Response

```json
{
  "parameters": {
    "T2M": {
      "20241001": 28.5,
      "20241002": 29.1,
      "20241003": 27.8
    },
    "PRECTOTCORR": {
      "20241001": 0.5,
      "20241002": 2.3,
      "20241003": 0.0
    },
    "WS10M": {
      "20241001": 12.3,
      "20241002": 15.6,
      "20241003": 11.2
    },
    "RH2M": {
      "20241001": 75,
      "20241002": 78,
      "20241003": 72
    }
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-0.1870, 5.6037]
  }
}
```

### Rate Limits
- No explicit rate limit documented
- Recommended: Implement caching (24 hours for historical data)
- Use Redis to cache responses by coordinates and date range

### Error Handling

```python
# Example Python error handling
try:
    response = requests.get(nasa_url, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()
    
    if 'parameters' not in data:
        raise ValueError("Invalid NASA API response format")
        
except requests.exceptions.Timeout:
    # Handle timeout - retry or return cached data
    pass
except requests.exceptions.RequestException as e:
    # Handle network errors
    pass
```

---

## Google Gemini AI Integration

### Setup

```bash
npm install @google/generative-ai
# or
pip install google-generativeai
```

### Python Example

```python
import google.generativeai as genai
import os

# Configure API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Initialize model
model = genai.GenerativeModel('gemini-1.5-flash')

async def generate_weather_advice(
    location: str,
    purpose: str,
    conditions: list,
    weather_summary: dict
) -> str:
    """
    Generate contextual weather advice using Gemini AI
    """
    
    prompt = f"""
    You are an experienced meteorologist and event planner providing advice 
    for extreme weather conditions.
    
    Location: {location}
    Purpose/Event: {purpose}
    Expected Conditions: {', '.join(conditions)}
    
    Weather Summary:
    - Average Temperature: {weather_summary['avgTemp']}°C
    - Maximum Wind Speed: {weather_summary['maxWind']} m/s
    - Total Rainfall: {weather_summary['totalRain']} mm
    - Average Humidity: {weather_summary['avgHumidity']}%
    
    Provide practical, actionable advice in 3-4 paragraphs covering:
    1. Key weather concerns for this specific event/purpose
    2. Safety precautions and preparations needed
    3. Timing recommendations (best/worst times of day)
    4. Backup plans or contingencies
    
    Be conversational, empathetic, and specific to the location and purpose.
    Focus on practical, real-world advice that helps the user plan effectively.
    """
    
    try:
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        # Fallback to template-based advice
        return generate_fallback_advice(location, purpose, conditions)

def generate_fallback_advice(location, purpose, conditions):
    """Fallback advice when AI is unavailable"""
    return f"""
    For your {purpose.lower()} in {location}, please be prepared for 
    {', '.join(conditions).lower()} conditions. 
    
    Ensure you have appropriate gear, stay hydrated, and monitor weather 
    updates regularly. Safety should always be your top priority.
    
    Consider having backup plans in place and consult with local authorities 
    for the latest weather warnings and advisories.
    """
```

### Node.js/TypeScript Example

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

interface WeatherSummary {
  avgTemp: number
  maxWind: number
  totalRain: number
  avgHumidity: number
}

async function generateWeatherAdvice(
  location: string,
  purpose: string,
  conditions: string[],
  weatherSummary: WeatherSummary
): Promise<string> {
  const prompt = `
    You are an experienced meteorologist and event planner providing advice 
    for extreme weather conditions.
    
    Location: ${location}
    Purpose/Event: ${purpose}
    Expected Conditions: ${conditions.join(', ')}
    
    Weather Summary:
    - Average Temperature: ${weatherSummary.avgTemp}°C
    - Maximum Wind Speed: ${weatherSummary.maxWind} m/s
    - Total Rainfall: ${weatherSummary.totalRain} mm
    - Average Humidity: ${weatherSummary.avgHumidity}%
    
    Provide practical, actionable advice in 3-4 paragraphs covering:
    1. Key weather concerns for this specific event/purpose
    2. Safety precautions and preparations needed
    3. Timing recommendations (best/worst times of day)
    4. Backup plans or contingencies
    
    Be conversational, empathetic, and specific to the location and purpose.
    Focus on practical, real-world advice that helps the user plan effectively.
  `
  
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini AI error:', error)
    return generateFallbackAdvice(location, purpose, conditions)
  }
}
```

### Rate Limits
- Free tier: 15 requests per minute, 1,500 requests per day
- Paid tier: 360 requests per minute
- Implement request queuing and rate limiting

---

## Database Schema

### PostgreSQL Schema

```sql
-- Users table (optional, for future authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weather queries table (for analytics and caching)
CREATE TABLE weather_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(11, 7) NOT NULL,
    purpose TEXT NOT NULL,
    conditions TEXT[] NOT NULL,
    target_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for faster queries
    INDEX idx_location (location),
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_target_date (target_date),
    INDEX idx_created_at (created_at)
);

-- Weather data cache
CREATE TABLE weather_data_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(11, 7) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    data JSONB NOT NULL,
    source VARCHAR(50) DEFAULT 'NASA_POWER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Composite unique index for cache lookup
    UNIQUE (latitude, longitude, start_date, end_date, source),
    INDEX idx_expires_at (expires_at)
);

-- AI advice cache
CREATE TABLE ai_advice_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    conditions TEXT[] NOT NULL,
    advice TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    INDEX idx_location_purpose (location, purpose),
    INDEX idx_expires_at (expires_at)
);

-- Extreme analysis results
CREATE TABLE extreme_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID REFERENCES weather_queries(id) ON DELETE CASCADE,
    condition VARCHAR(50) NOT NULL,
    probability DECIMAL(5, 4) NOT NULL CHECK (probability >= 0 AND probability <= 1),
    threshold DECIMAL(10, 2) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'extreme')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_query_id (query_id)
);

-- API usage tracking (for rate limiting and analytics)
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    response_time_ms INTEGER,
    status_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id_created (user_id, created_at),
    INDEX idx_ip_created (ip_address, created_at)
);
```

### MongoDB Schema (Alternative)

```javascript
// users collection
{
  _id: ObjectId,
  email: String,
  createdAt: Date,
  updatedAt: Date
}

// weatherQueries collection
{
  _id: ObjectId,
  userId: ObjectId,
  location: String,
  coordinates: {
    type: "Point",
    coordinates: [longitude, latitude]  // GeoJSON format
  },
  purpose: String,
  conditions: [String],
  targetDate: Date,
  weatherData: {
    temperature: [Number],
    windspeed: [Number],
    rainfall: [Number],
    humidity: [Number],
    timestamps: [String]
  },
  extremeAnalysis: [{
    condition: String,
    probability: Number,
    threshold: Number,
    severity: String
  }],
  aiAdvice: String,
  createdAt: Date
}

// weatherDataCache collection
{
  _id: ObjectId,
  coordinates: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  dateRange: {
    start: Date,
    end: Date
  },
  data: Object,
  source: String,
  createdAt: Date,
  expiresAt: Date
}

// Create indexes
db.weatherQueries.createIndex({ "coordinates": "2dsphere" })
db.weatherQueries.createIndex({ "targetDate": 1 })
db.weatherQueries.createIndex({ "createdAt": -1 })
db.weatherDataCache.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })
```

---

## Authentication & Security

### API Key Authentication (Recommended for MVP)

```typescript
// Middleware example
import { Request, Response, NextFunction } from 'express'

const API_KEYS = new Set(process.env.API_KEYS?.split(',') || [])

export function authenticateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers['x-api-key'] as string
  
  if (!apiKey || !API_KEYS.has(apiKey)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or missing API key'
      }
    })
  }
  
  next()
}
```

### JWT Authentication (For User Accounts)

```typescript
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1] // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Authentication required' }
    })
  }
  
  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
    })
  }
}
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const weatherAnalysisLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:weather:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 weather analyses per hour
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Weather analysis limit exceeded. Please wait before making more requests.'
    }
  }
})
```

### CORS Configuration

```typescript
import cors from 'cors'

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://opesubere.com', 'https://www.opesubere.com']
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}

app.use(cors(corsOptions))
```

---

## Error Handling

### Standard Error Response Format

```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
    stack?: string  // Only in development
  }
  metadata: {
    timestamp: string
    requestId: string
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_INPUT` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `NASA_API_ERROR` | 502 | NASA API unavailable or error |
| `GEMINI_API_ERROR` | 502 | Gemini AI API error |
| `GEOCODING_ERROR` | 502 | Geocoding service error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Error Handler Middleware

```typescript
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = uuidv4()
  
  // Log error
  console.error({
    requestId,
    error: err,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  })
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId
      }
    })
  }
  
  // Unexpected errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err.message 
      })
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId
    }
  })
}
```

---

## Deployment Guidelines

### Environment Setup

**Development:**
```bash
NODE_ENV=development
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost:5432/opesubere_dev
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_api_key_here
JWT_SECRET=your_secret_here
GEOCODING_API_KEY=your_geocoding_api_key
FRONTEND_URL=http://localhost:3000
```

**Production:**
```bash
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://user:pass@prod-db:5432/opesubere
REDIS_URL=redis://prod-redis:6379
GEMINI_API_KEY=your_api_key_here
JWT_SECRET=strong_random_secret
GEOCODING_API_KEY=your_geocoding_api_key
FRONTEND_URL=https://opesubere.com
SENTRY_DSN=your_sentry_dsn  # Optional: Error tracking
```

### Docker Setup

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 8000

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/opesubere
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped
  
  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=opesubere
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Deployment Platforms

**1. Railway / Render / Fly.io (Recommended for MVP)**
- Easy deployment from GitHub
- Built-in PostgreSQL and Redis
- Auto-scaling
- Free tier available

**2. AWS (For Production Scale)**
- ECS/Fargate for container orchestration
- RDS for PostgreSQL
- ElastiCache for Redis
- CloudFront CDN
- Route 53 for DNS

**3. DigitalOcean App Platform**
- Simplified deployment
- Managed databases
- Auto-scaling

---

## Environment Variables

```bash
# Server
NODE_ENV=production|development
PORT=8000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DB_POOL_SIZE=20
DB_SSL=true

# Redis
REDIS_URL=redis://host:6379
REDIS_PASSWORD=optional_password

# External APIs
NASA_POWER_API_BASE=https://power.larc.nasa.gov/api
GEMINI_API_KEY=your_gemini_api_key
GEOCODING_API_KEY=your_geocoding_api_key
GEOCODING_PROVIDER=opencage|mapbox|google

# Authentication
JWT_SECRET=strong_random_secret_min_32_chars
API_KEYS=key1,key2,key3
JWT_EXPIRY=7d

# Security
CORS_ORIGINS=https://opesubere.com,https://www.opesubere.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging & Monitoring
LOG_LEVEL=info|debug|error
SENTRY_DSN=your_sentry_dsn_optional

# Frontend
FRONTEND_URL=https://opesubere.com

# Cache Settings
WEATHER_CACHE_TTL=86400  # 24 hours in seconds
AI_ADVICE_CACHE_TTL=3600  # 1 hour in seconds
```

---

## Implementation Priority

### Phase 1: MVP (Weeks 1-2)
1. ✅ Basic Express/FastAPI setup
2. ✅ NASA POWER API integration
3. ✅ Weather analysis endpoint (`POST /api/weather/analyze`)
4. ✅ Geocoding integration
5. ✅ Basic error handling
6. ✅ CORS configuration

### Phase 2: AI & Caching (Week 3)
1. ✅ Google Gemini AI integration
2. ✅ AI advice endpoint (`POST /api/advice/generate`)
3. ✅ Redis caching layer
4. ✅ Database setup (PostgreSQL or MongoDB)

### Phase 3: Production Ready (Week 4)
1. ✅ Rate limiting
2. ✅ API authentication
3. ✅ Comprehensive error handling
4. ✅ Logging and monitoring
5. ✅ Docker configuration
6. ✅ Deployment setup

### Phase 4: Optimization (Ongoing)
1. ✅ Performance optimization
2. ✅ Advanced caching strategies
3. ✅ Analytics dashboard
4. ✅ User accounts and history

---

## Testing Recommendations

### Unit Tests
```typescript
// Example with Jest
describe('Weather Analysis Service', () => {
  it('should analyze extreme weather conditions', async () => {
    const result = await analyzeWeather({
      location: 'Accra, Ghana',
      conditions: ['Very Hot'],
      date: new Date('2025-12-25')
    })
    
    expect(result.extremeAnalysis).toHaveLength(1)
    expect(result.extremeAnalysis[0].condition).toBe('Very Hot')
    expect(result.extremeAnalysis[0].probability).toBeGreaterThan(0)
  })
})
```

### Integration Tests
```typescript
describe('POST /api/weather/analyze', () => {
  it('should return weather analysis', async () => {
    const response = await request(app)
      .post('/api/weather/analyze')
      .send({
        location: 'Accra, Ghana',
        purpose: 'Outdoor Wedding',
        conditions: ['Very Hot'],
        date: '2025-12-25T00:00:00Z'
      })
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.weatherData).toBeDefined()
  })
})
```

---

## Support & Resources

- **NASA POWER API Docs:** https://power.larc.nasa.gov/docs/
- **Google Gemini Docs:** https://ai.google.dev/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Redis Docs:** https://redis.io/documentation

---

**Document Version:** 1.0.0  
**Last Updated:** October 4, 2025  
**Maintained by:** Opɛsu bere Development Team

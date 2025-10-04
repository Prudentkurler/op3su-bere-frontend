'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import CompoundExtremeAnalysis from '@/components/CompoundExtremeAnalysis'
import ElderAdvice from '@/components/ElderAdvice'
import GeospatialSegmentation from '@/components/GeospatialSegmentation'
import WeatherCharts from '@/components/WeatherCharts'
import SummarySection from '@/components/SummarySection'
import StatsOverview from '@/components/StatsOverview'
import { useWeatherStore } from '@/store/weather'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Mock location coordinates (in a real app, use geocoding API)
const getLocationCoordinates = (location: string): { lat: number; lon: number } => {
  const locations: Record<string, { lat: number; lon: number }> = {
    'New York': { lat: 40.7128, lon: -74.0060 },
    'London': { lat: 51.5074, lon: -0.1278 },
    'Tokyo': { lat: 35.6762, lon: 139.6503 },
    'Paris': { lat: 48.8566, lon: 2.3522 },
    'Sydney': { lat: -33.8688, lon: 151.2093 },
    'Mumbai': { lat: 19.0760, lon: 72.8777 },
    'Dubai': { lat: 25.2048, lon: 55.2708 },
    'Singapore': { lat: 1.3521, lon: 103.8198 },
    'Los Angeles': { lat: 34.0522, lon: -118.2437 },
    'Chicago': { lat: 41.8781, lon: -87.6298 },
  }
  
  // Search for partial matches
  for (const [city, coords] of Object.entries(locations)) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return coords
    }
  }
  
  // Default to San Francisco if location not found
  return { lat: 37.7749, lon: -122.4194 }
}

export default function Dashboard() {
  const router = useRouter()
  const {
    query,
    weatherData,
    extremeAnalysis,
    elderAdvice,
    isLoading,
    setWeatherData,
    setExtremeAnalysis,
    setElderAdvice,
    setLoading,
  } = useWeatherStore()

  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      router.push('/')
      return
    }

    // Simulate fetching weather data
    const fetchWeatherData = async () => {
      setLoading(true)
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Generate more realistic mock data based on query
        const baseTemp = query.conditions.includes('Very Hot') ? 35 : 
                        query.conditions.includes('Very Cold') ? 5 : 22
        
        const baseWind = query.conditions.includes('Very Windy') ? 45 : 15
        const baseRain = query.conditions.includes('Very Wet') ? 8 : 2
        const baseHumidity = query.conditions.includes('Very Uncomfortable') ? 85 : 60

        const mockWeatherData = {
          temperature: Array.from({ length: 14 }, (_, i) => {
            const dailyVariation = Math.sin(i / 2) * 3
            const randomNoise = (Math.random() - 0.5) * 4
            return Math.max(0, baseTemp + dailyVariation + randomNoise)
          }),
          windspeed: Array.from({ length: 14 }, (_, i) => {
            const dailyVariation = Math.cos(i / 3) * 8
            const randomNoise = (Math.random() - 0.5) * 5
            return Math.max(0, baseWind + dailyVariation + randomNoise)
          }),
          rainfall: Array.from({ length: 14 }, (_, i) => {
            const randomFactor = Math.random()
            return randomFactor > 0.6 ? baseRain * randomFactor : Math.random() * 2
          }),
          humidity: Array.from({ length: 14 }, (_, i) => {
            const dailyVariation = Math.sin(i / 1.5) * 10
            const randomNoise = (Math.random() - 0.5) * 5
            return Math.max(20, Math.min(100, baseHumidity + dailyVariation + randomNoise))
          }),
          timestamps: Array.from({ length: 14 }, (_, i) => {
            const date = new Date(query.date)
            date.setDate(date.getDate() - 7 + i)
            return date.toISOString()
          }),
        }

        setWeatherData(mockWeatherData)

        // Generate extreme analysis based on selected conditions with realistic probabilities
        const mockAnalysis = query.conditions.map((condition) => {
          let probability = 0.3 + Math.random() * 0.5
          let threshold = 0
          let severity: 'low' | 'moderate' | 'high' | 'extreme' = 'moderate'

          if (condition === 'Very Hot') {
            threshold = 35
            probability = baseTemp > 30 ? 0.6 + Math.random() * 0.3 : 0.2 + Math.random() * 0.3
            severity = probability > 0.75 ? 'extreme' : probability > 0.6 ? 'high' : probability > 0.4 ? 'moderate' : 'low'
          } else if (condition === 'Very Cold') {
            threshold = 5
            probability = baseTemp < 10 ? 0.6 + Math.random() * 0.3 : 0.1 + Math.random() * 0.2
            severity = probability > 0.7 ? 'extreme' : probability > 0.5 ? 'high' : probability > 0.3 ? 'moderate' : 'low'
          } else if (condition === 'Very Windy') {
            threshold = 40
            probability = baseWind > 35 ? 0.65 + Math.random() * 0.25 : 0.15 + Math.random() * 0.3
            severity = probability > 0.75 ? 'extreme' : probability > 0.55 ? 'high' : probability > 0.35 ? 'moderate' : 'low'
          } else if (condition === 'Very Wet') {
            threshold = 50
            probability = baseRain > 6 ? 0.7 + Math.random() * 0.25 : 0.2 + Math.random() * 0.3
            severity = probability > 0.7 ? 'extreme' : probability > 0.5 ? 'high' : probability > 0.35 ? 'moderate' : 'low'
          } else if (condition === 'Very Uncomfortable') {
            threshold = 80
            probability = baseHumidity > 75 ? 0.65 + Math.random() * 0.25 : 0.25 + Math.random() * 0.3
            severity = probability > 0.7 ? 'extreme' : probability > 0.55 ? 'high' : probability > 0.4 ? 'moderate' : 'low'
          }

          return {
            condition,
            probability,
            threshold,
            severity,
          }
        })

        setExtremeAnalysis(mockAnalysis)

        // Geocode location for map (mock coordinates)
        const mockCoordinates = getLocationCoordinates(query.location)
        if (!query.lat && !query.lon) {
          query.lat = mockCoordinates.lat
          query.lon = mockCoordinates.lon
        }

        // Generate AI advice using Gemini
        await generateElderAdvice(query.location, query.purpose, query.conditions)

      } catch (error) {
        console.error('Error fetching weather data:', error)
        setFetchError('Failed to fetch weather data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [query])

  const generateElderAdvice = async (location: string, purpose: string, conditions: string[]) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      
      if (!apiKey) {
        // Fallback advice if no API key
        setElderAdvice(
          `For your ${purpose.toLowerCase()} in ${location}, please be prepared for ${conditions.join(', ').toLowerCase()} conditions. Ensure you have appropriate gear, stay hydrated, and monitor weather updates regularly. Safety should always be your top priority.`
        )
        return
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const prompt = `You are a wise weather advisor with local knowledge. Provide brief, practical advice (2-3 sentences) for someone planning a ${purpose} in ${location}, considering these weather concerns: ${conditions.join(', ')}. Be culturally sensitive and give actionable tips.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      setElderAdvice(text)
    } catch (error) {
      console.error('Error generating AI advice:', error)
      setElderAdvice(
        `For your ${purpose.toLowerCase()} in ${location}, please be prepared for ${conditions.join(', ').toLowerCase()} conditions. Ensure you have appropriate gear, stay hydrated, and monitor weather updates regularly.`
      )
    }
  }

  if (!query) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg">
        <LoadingSkeleton />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-400">{fetchError}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return null
  }

  return (
    <div className="min-h-screen gradient-bg">
      
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient">Opɛsu bere</span>
            </h1>
            <p className="text-gray-400 text-lg">
              <span className="text-blue-400">{query.location}</span> • {' '}
              <span className="text-violet-400">{query.purpose}</span>
            </p>
          </motion.div>

          {/* Stats Overview */}
          {weatherData && (
            <StatsOverview
              query={query}
              avgTemp={weatherData.temperature.reduce((a, b) => a + b, 0) / weatherData.temperature.length}
              maxWind={Math.max(...weatherData.windspeed)}
              totalRain={weatherData.rainfall.reduce((a, b) => a + b, 0)}
              avgHumidity={weatherData.humidity.reduce((a, b) => a + b, 0) / weatherData.humidity.length}
            />
          )}

          {/* Dashboard Grid - 2 columns */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Compound Extreme Analysis */}
              {extremeAnalysis.length > 0 && (
                <CompoundExtremeAnalysis analysis={extremeAnalysis} />
              )}

              {/* Elder's Advice */}
              <ElderAdvice advice={elderAdvice} isLoading={!elderAdvice} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Weather Charts */}
              {weatherData && <WeatherCharts data={weatherData} />}
            </div>
          </div>

          {/* Full Width Sections */}
          <div className="mt-6 space-y-6">
            {/* Geospatial Segmentation */}
            <GeospatialSegmentation
              lat={query.lat || 0}
              lon={query.lon || 0}
              location={query.location}
            />

            {/* Summary Section */}
            {weatherData && <SummarySection query={query} weatherData={weatherData} />}
          </div>
        </div>
      </main>

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  )
}

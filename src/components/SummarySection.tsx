'use client'

import { motion } from 'framer-motion'
import { FileText, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { WeatherData, WeatherQuery } from '@/store/weather'
import { downloadCSV, downloadJSON, formatDate } from '@/lib/utils'

interface SummarySectionProps {
  query: WeatherQuery
  weatherData: WeatherData
}

export default function SummarySection({ query, weatherData }: SummarySectionProps) {
  const handleDownloadJSON = () => {
    const data = {
      query: {
        location: query.location,
        purpose: query.purpose,
        conditions: query.conditions,
        date: query.date.toISOString(),
      },
      weatherData,
      exportedAt: new Date().toISOString(),
    }
    downloadJSON(data, `weather-data-${query.location}-${formatDate(query.date)}.json`)
  }

  const handleDownloadCSV = () => {
    const csvData = weatherData.timestamps.map((timestamp, index) => ({
      timestamp,
      temperature: weatherData.temperature[index],
      windspeed: weatherData.windspeed[index],
      rainfall: weatherData.rainfall[index],
      humidity: weatherData.humidity[index],
    }))
    downloadCSV(csvData, `weather-data-${query.location}-${formatDate(query.date)}.csv`)
  }

  // Calculate summary statistics
  const avgTemp = weatherData.temperature.reduce((a, b) => a + b, 0) / weatherData.temperature.length
  const maxTemp = Math.max(...weatherData.temperature)
  const minTemp = Math.min(...weatherData.temperature)
  const avgWind = weatherData.windspeed.reduce((a, b) => a + b, 0) / weatherData.windspeed.length
  const totalRain = weatherData.rainfall.reduce((a, b) => a + b, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" />
            Weather Summary
          </CardTitle>
          <CardDescription>
            Overview and data export for {query.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Text */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-semibold text-lg mb-3 text-gray-200">Outlook for {formatDate(query.date)}</h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              Based on NASA Earth observation data, we've analyzed extreme weather patterns for <strong className="text-blue-400">{query.location}</strong> on{' '}
              <strong className="text-violet-400">{formatDate(query.date)}</strong> for your planned activity:{' '}
              <strong className="text-blue-400">{query.purpose}</strong>.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400 mb-1">Avg Temperature</div>
                <div className="text-xl font-semibold text-red-400">{avgTemp.toFixed(1)}°C</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400 mb-1">Temp Range</div>
                <div className="text-xl font-semibold text-orange-400">
                  {minTemp.toFixed(0)}° - {maxTemp.toFixed(0)}°
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400 mb-1">Avg Wind Speed</div>
                <div className="text-xl font-semibold text-blue-400">{avgWind.toFixed(1)} km/h</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400 mb-1">Total Rainfall</div>
                <div className="text-xl font-semibold text-cyan-400">{totalRain.toFixed(1)} mm</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400 mb-1">Conditions Tracked</div>
                <div className="text-xl font-semibold text-violet-400">{query.conditions.length}</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-xs text-gray-400 mb-1">Day of Year</div>
                <div className="text-xl font-semibold text-purple-400">{query.dayOfYear}</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20">
            <h5 className="font-semibold mb-2 text-blue-300">Planning Recommendations</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Monitor weather conditions closely as your planned date approaches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Prepare appropriate gear based on the extreme conditions identified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Consider backup plans if high-risk conditions are forecasted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Stay informed with local weather alerts and updates</span>
              </li>
            </ul>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownloadCSV}
              variant="outline"
              className="flex-1 group"
            >
              <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
              Download CSV
            </Button>
            <Button
              onClick={handleDownloadJSON}
              variant="outline"
              className="flex-1 group"
            >
              <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
              Download JSON
            </Button>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center p-6 rounded-lg bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <h5 className="text-lg font-semibold mb-2 text-gradient">Plan Better with Weather Insights</h5>
            <p className="text-sm text-gray-400 mb-4">
              Make informed decisions based on comprehensive NASA data analysis
            </p>
            <Button size="lg" onClick={() => window.location.href = '/'}>
              Analyze Another Location
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

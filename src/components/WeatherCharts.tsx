'use client'

import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { WeatherData } from '@/store/weather'

interface WeatherChartsProps {
  data: WeatherData
}

export default function WeatherCharts({ data }: WeatherChartsProps) {
  // Transform data for charts
  const chartData = data.timestamps.map((timestamp, index) => ({
    time: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temperature: data.temperature[index],
    windspeed: data.windspeed[index],
    rainfall: data.rainfall[index],
    humidity: data.humidity[index],
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-white/20 rounded-xl p-4 backdrop-blur-xl shadow-2xl">
          <p className="text-sm font-semibold text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
              <span className="text-gray-400">{entry.name}:</span>
              <span className="font-semibold">{entry.value.toFixed(1)}{entry.unit}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Weather Analysis
          </CardTitle>
          <CardDescription>
            14-day forecast and historical data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Combined Temperature & Humidity Chart */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></span>
              Temperature & Humidity
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#ef4444"
                  tick={{ fill: '#ef4444', fontSize: 12 }}
                  tickLine={{ stroke: '#ef4444' }}
                  label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#ef4444' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#8b5cf6"
                  tick={{ fill: '#8b5cf6', fontSize: 12 }}
                  tickLine={{ stroke: '#8b5cf6' }}
                  label={{ value: '%', angle: 90, position: 'insideRight', fill: '#8b5cf6' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#colorTemp)"
                  name="Temperature"
                  unit="°C"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorHumidity)"
                  name="Humidity"
                  unit="%"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Wind Speed Chart */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Wind Speed
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  stroke="#06b6d4"
                  tick={{ fill: '#06b6d4', fontSize: 12 }}
                  tickLine={{ stroke: '#06b6d4' }}
                  label={{ value: 'km/h', angle: -90, position: 'insideLeft', fill: '#06b6d4' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="windspeed"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 5, strokeWidth: 2, stroke: '#0c1628' }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                  name="Wind Speed"
                  unit=" km/h"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rainfall Chart */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Precipitation
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  tickLine={{ stroke: '#ffffff20' }}
                />
                <YAxis 
                  stroke="#3b82f6"
                  tick={{ fill: '#3b82f6', fontSize: 12 }}
                  tickLine={{ stroke: '#3b82f6' }}
                  label={{ value: 'mm', angle: -90, position: 'insideLeft', fill: '#3b82f6' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorRain)"
                  name="Rainfall"
                  unit=" mm"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

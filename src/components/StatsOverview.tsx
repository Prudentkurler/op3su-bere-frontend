'use client'

import { motion } from 'framer-motion'
import { Thermometer, Wind, CloudRain, Droplets, AlertTriangle, Calendar } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { WeatherQuery } from '@/store/weather'
import { formatDate } from '@/lib/utils'

interface StatsOverviewProps {
  query: WeatherQuery
  avgTemp: number
  maxWind: number
  totalRain: number
  avgHumidity: number
}

export default function StatsOverview({ query, avgTemp, maxWind, totalRain, avgHumidity }: StatsOverviewProps) {
  const stats = [
    {
      icon: Calendar,
      label: 'Target Date',
      value: formatDate(query.date),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Thermometer,
      label: 'Avg Temperature',
      value: `${avgTemp.toFixed(1)}°C`,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Wind,
      label: 'Max Wind Speed',
      value: `${maxWind.toFixed(1)} km/h`,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: CloudRain,
      label: 'Total Rainfall',
      value: `${totalRain.toFixed(1)} mm`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Droplets,
      label: 'Avg Humidity',
      value: `${avgHumidity.toFixed(0)}%`,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: AlertTriangle,
      label: 'Concerns',
      value: query.conditions.length.toString(),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="relative overflow-hidden group hover:border-white/20 transition-all cursor-default">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
            
            {/* Hover effect */}
            <motion.div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 ${stat.bgColor}`}
              initial={false}
            />
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

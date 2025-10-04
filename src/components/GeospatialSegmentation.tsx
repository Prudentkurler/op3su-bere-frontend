'use client'

import { motion } from 'framer-motion'
import { Map as MapIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useEffect, useState } from 'react'

interface GeospatialSegmentationProps {
  lat?: number
  lon?: number
  location: string
}

type MapComponentType = React.ComponentType<{ lat: number; lon: number; location: string }>

export default function GeospatialSegmentation({ lat = 0, lon = 0, location }: GeospatialSegmentationProps) {
  const [MapComponent, setMapComponent] = useState<MapComponentType | null>(null)

  useEffect(() => {
    // Dynamically import map component on client side only
    import('./WeatherMap').then((mod) => {
      setMapComponent(() => mod.default as MapComponentType)
    })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-blue-500" />
            Geospatial Risk Analysis
          </CardTitle>
          <CardDescription>
            Interactive map showing risk zones for {location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-white/10">
            {MapComponent ? (
              <MapComponent lat={lat} lon={lon} location={location} />
            ) : (
              <div className="h-[400px] bg-white/5 rounded-lg flex items-center justify-center">
                <div className="text-gray-400">Loading map...</div>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Low Risk', color: 'bg-green-500', value: '< 25%' },
              { label: 'Moderate Risk', color: 'bg-yellow-500', value: '25-50%' },
              { label: 'High Risk', color: 'bg-orange-500', value: '50-75%' },
              { label: 'Extreme Risk', color: 'bg-red-500', value: '> 75%' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
              >
                <div className={`w-4 h-4 rounded-full ${item.color}`} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-300">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

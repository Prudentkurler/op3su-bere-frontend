'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Target, CloudRain } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { useWeatherStore, WeatherCondition } from '@/store/weather'
import { getDayOfYear } from '@/lib/utils'

const weatherConditions: WeatherCondition[] = [
  'Very Hot',
  'Very Cold',
  'Very Windy',
  'Very Wet',
  'Very Uncomfortable'
]

const purposePresets = [
  'Hiking',
  'Vacation',
  'Fishing',
  'Camping',
  'Outdoor Event',
  'Agriculture',
  'Construction',
  'Other'
]

export default function WeatherInputForm() {
  const router = useRouter()
  const { setQuery, setLoading } = useWeatherStore()
  
  const [location, setLocation] = useState('')
  const [purpose, setPurpose] = useState('')
  const [selectedConditions, setSelectedConditions] = useState<WeatherCondition[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  const handleConditionToggle = (condition: WeatherCondition) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!location || !purpose || selectedConditions.length === 0 || !selectedDate) {
      alert('Please fill in all fields')
      return
    }

    const date = new Date(selectedDate)
    const query = {
      location,
      purpose,
      conditions: selectedConditions,
      date,
      dayOfYear: getDayOfYear(date)
    }

    setQuery(query)
    setLoading(true)
    
    // Navigate to dashboard
    router.push('/dashboard')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl">Get Weather Insights</CardTitle>
          <CardDescription>
            Enter your location and preferences to receive personalized extreme weather analysis
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Input */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                Location
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="Enter city or coordinates..."
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    setShowLocationSuggestions(e.target.value.length > 2)
                  }}
                  onFocus={() => setShowLocationSuggestions(location.length > 2)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  className="glow-border"
                />
                {/* Location suggestions would go here */}
              </div>
            </div>

            {/* Purpose/Event Input */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-violet-400" />
                Purpose/Event
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                {purposePresets.map((preset) => (
                  <motion.button
                    key={preset}
                    type="button"
                    onClick={() => setPurpose(preset)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      purpose === preset
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>
              <Input
                id="purpose"
                placeholder="Or enter custom purpose..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="glow-border"
              />
            </div>

            {/* Weather Conditions Multi-select */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-blue-400" />
                Weather Conditions of Concern
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                {weatherConditions.map((condition) => (
                  <motion.div
                    key={condition}
                    className="flex items-center space-x-2"
                    whileHover={{ x: 4 }}
                  >
                    <Checkbox
                      id={condition}
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                    />
                    <Label
                      htmlFor={condition}
                      className="cursor-pointer flex-1 text-sm"
                    >
                      {condition}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Date Selector */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-400" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="glow-border"
              />
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 font-semibold">
                  Get Weather Insights
                </span>
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { ExtremeAnalysis } from '@/store/weather'

interface CompoundExtremeAnalysisProps {
  analysis: ExtremeAnalysis[]
}

export default function CompoundExtremeAnalysis({ analysis }: CompoundExtremeAnalysisProps) {
  // Generate probability distribution data
  const distributionData = analysis.map((item, index) => ({
    condition: item.condition,
    probability: item.probability,
    threshold: item.threshold,
  }))

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400'
      case 'moderate': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'extreme': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20'
      case 'moderate': return 'bg-yellow-500/20'
      case 'high': return 'bg-orange-500/20'
      case 'extreme': return 'bg-red-500/20'
      default: return 'bg-gray-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Compound Extreme Analysis
          </CardTitle>
          <CardDescription>
            Probability analysis of extreme weather conditions for your selected date and location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.map((item, index) => (
              <motion.div
                key={item.condition}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border border-white/10 ${getSeverityBg(item.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-200">{item.condition}</h4>
                  <AlertTriangle className={`h-5 w-5 ${getSeverityColor(item.severity)}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Probability:</span>
                    <span className={`font-semibold ${getSeverityColor(item.severity)}`}>
                      {(item.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Severity:</span>
                    <span className={`font-semibold capitalize ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>
                </div>
                {/* Probability bar */}
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getSeverityBg(item.severity).replace('/20', '')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.probability * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Probability Distribution Chart */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-200">Probability Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={distributionData}>
                <defs>
                  <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  dataKey="condition" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)',
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                  formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
                />
                <Area
                  type="monotone"
                  dataKey="probability"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProbability)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header skeleton */}
        <motion.div
          className="h-12 bg-white/5 rounded-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Cards skeleton */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="glassmorphism rounded-2xl p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="h-8 bg-white/5 rounded w-1/3" />
            <div className="h-64 bg-white/5 rounded" />
          </motion.div>
        ))}

        {/* Loading message */}
        <motion.div
          className="flex items-center justify-center gap-2 text-blue-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AlertCircle className="h-5 w-5" />
          <span>Fetching NASA weather data...</span>
        </motion.div>
      </div>
    </div>
  )
}

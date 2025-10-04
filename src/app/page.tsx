'use client'

import { motion } from 'framer-motion'
import WeatherInputForm from '@/components/WeatherInputForm'
import ParticlesBackground from '@/components/ParticlesBackground'
import { Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex items-center justify-center p-4">
      <ParticlesBackground />
      
      <main className="w-full max-w-4xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-gray-300">Powered by NASA Earth Observation Data</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-gradient">Opɛsu bere</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get personalized extreme weather insights for your activities
          </p>
        </motion.div>

        {/* Input Form */}
        <WeatherInputForm />
      </main>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  )
}

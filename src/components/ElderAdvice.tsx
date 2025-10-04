'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useEffect, useState } from 'react'

interface ElderAdviceProps {
  advice: string | null
  isLoading?: boolean
}

export default function ElderAdvice({ advice, isLoading }: ElderAdviceProps) {
  const [displayedAdvice, setDisplayedAdvice] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Typewriter effect
  useEffect(() => {
    if (!advice) return
    
    if (currentIndex < advice.length) {
      const timeout = setTimeout(() => {
        setDisplayedAdvice(prev => prev + advice[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 30)
      
      return () => clearTimeout(timeout)
    }
  }, [advice, currentIndex])

  // Reset when advice changes
  useEffect(() => {
    setDisplayedAdvice('')
    setCurrentIndex(0)
  }, [advice])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="h-6 w-6 text-violet-500" />
            </motion.div>
            Elder's Wisdom
          </CardTitle>
          <CardDescription>
            AI-generated context-aware advice for your weather conditions
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="flex gap-4">
            {/* Avatar */}
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-violet-500/50"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>

            {/* Advice Text */}
            <div className="flex-1 p-4 rounded-lg bg-white/5 border border-white/10">
              {isLoading ? (
                <div className="space-y-2">
                  <motion.div
                    className="h-4 bg-white/10 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="h-4 bg-white/10 rounded w-5/6"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="h-4 bg-white/10 rounded w-4/6"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              ) : (
                <motion.p
                  className="text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {displayedAdvice}
                  {currentIndex < (advice?.length || 0) && (
                    <motion.span
                      className="inline-block w-1 h-4 bg-violet-500 ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.p>
              )}
            </div>
          </div>

          {/* Cultural decoration */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <span>Powered by Gemini AI</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

import { create } from 'zustand'

export type WeatherCondition = 'Very Hot' | 'Very Cold' | 'Very Windy' | 'Very Wet' | 'Very Uncomfortable'

export interface WeatherQuery {
  location: string
  lat?: number
  lon?: number
  purpose: string
  conditions: WeatherCondition[]
  date: Date
  dayOfYear: number
}

export interface WeatherData {
  temperature: number[]
  windspeed: number[]
  rainfall: number[]
  humidity: number[]
  timestamps: string[]
}

export interface ExtremeAnalysis {
  condition: string
  probability: number
  threshold: number
  severity: 'low' | 'moderate' | 'high' | 'extreme'
}

interface WeatherState {
  query: WeatherQuery | null
  weatherData: WeatherData | null
  extremeAnalysis: ExtremeAnalysis[]
  elderAdvice: string | null
  isLoading: boolean
  error: string | null
  
  setQuery: (query: WeatherQuery) => void
  setWeatherData: (data: WeatherData) => void
  setExtremeAnalysis: (analysis: ExtremeAnalysis[]) => void
  setElderAdvice: (advice: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  query: null,
  weatherData: null,
  extremeAnalysis: [],
  elderAdvice: null,
  isLoading: false,
  error: null,
  
  setQuery: (query) => set({ query }),
  setWeatherData: (data) => set({ weatherData: data }),
  setExtremeAnalysis: (analysis) => set({ extremeAnalysis: analysis }),
  setElderAdvice: (advice) => set({ elderAdvice: advice }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    query: null,
    weatherData: null,
    extremeAnalysis: [],
    elderAdvice: null,
    isLoading: false,
    error: null
  })
}))

import { create } from 'zustand'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: {
    chartData?: any[]
    location?: string
    dateRange?: string
    images?: string[]
  }
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  currentQuery: string
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setLoading: (loading: boolean) => void
  setCurrentQuery: (query: string) => void
  clearMessages: () => void
  submitQuery: (query: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  currentQuery: '',
  
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    set((state) => ({
      messages: [...state.messages, newMessage]
    }))
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setCurrentQuery: (query) => set({ currentQuery: query }),
  
  clearMessages: () => set({ messages: [] }),

  submitQuery: async (query: string) => {
    const { addMessage, setLoading } = get()
    
    setLoading(true)
    
    // Add user message
    addMessage({
      type: 'user',
      content: query
    })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different status codes with appropriate messages
        let errorMessage = data.explanation || 'An unexpected error occurred.'
        
        if (response.status === 404) {
          errorMessage = data.explanation || 'Location not found in our database. Please try a larger nearby city.'
        } else if (response.status === 503) {
          errorMessage = data.explanation || 'Service temporarily unavailable. Please check your connection and try again.'
        } else if (response.status >= 500) {
          errorMessage = data.explanation || 'Server error. Please try again later.'
        }

        addMessage({
          type: 'assistant',
          content: `${data.summary || 'Error'}\n\n${errorMessage}`
        })
        return
      }

      if (!data.success) {
        addMessage({
          type: 'assistant',
          content: data.explanation || 'Sorry, I couldn\'t process your request. Please try rephrasing your question.'
        })
        return
      }

      // Add successful AI response
      addMessage({
        type: 'assistant',
        content: data.summary + (data.explanation ? '\n\n' + data.explanation : ''),
        data: {
          chartData: data.chartData,
          location: data.location,
          dateRange: data.dateRange
        }
      })

    } catch (error: any) {
      console.error('Query error:', error)
      
      // Network error handling
      let errorMessage = 'Unable to connect to our services. Please check your internet connection and try again.'
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network connection failed. Please check your internet connection or try again later.'
      }
      
      addMessage({
        type: 'assistant',
        content: `🌐 Connection Error\n\n${errorMessage}`
      })
    } finally {
      setLoading(false)
    }
  },
}))
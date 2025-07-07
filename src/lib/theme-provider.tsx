'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeProviderType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeProviderType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.className = savedTheme
      
      // Set initial background based on saved theme
      const body = document.body
      if (savedTheme === 'light') {
        body.style.background = 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)'
        body.style.backgroundSize = '400% 400%'
        body.style.animation = 'gradientShift 15s ease infinite'
      } else {
        body.style.background = 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #1e293b 100%)'
        body.style.backgroundSize = '400% 400%'
        body.style.animation = 'gradientShiftDark 20s ease infinite'
      }
    }
  }, [])

  const setThemeHandler = (newTheme: Theme) => {
    setTheme(newTheme)
    document.documentElement.className = newTheme
    localStorage.setItem('theme', newTheme)
    
    // Update body background based on theme
    const body = document.body
    if (newTheme === 'light') {
      body.style.background = 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #94a3b8 100%)'
      body.style.backgroundSize = '400% 400%'
      body.style.animation = 'gradientShift 15s ease infinite'
    } else {
      body.style.background = 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #1e293b 100%)'
      body.style.backgroundSize = '400% 400%'
      body.style.animation = 'gradientShiftDark 20s ease infinite'
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeHandler(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeHandler, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 
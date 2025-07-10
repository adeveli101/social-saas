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
      // Set only theme background, no gradients or animations
      document.body.style.background = 'var(--background)'
      document.body.style.backgroundSize = ''
      document.body.style.animation = ''
    }
  }, [])

  const setThemeHandler = (newTheme: Theme) => {
    setTheme(newTheme)
    document.documentElement.className = newTheme
    localStorage.setItem('theme', newTheme)
    // Set only theme background, no gradients or animations
    document.body.style.background = 'var(--background)'
    document.body.style.backgroundSize = ''
    document.body.style.animation = ''
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
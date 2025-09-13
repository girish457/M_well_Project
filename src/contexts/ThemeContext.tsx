'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get the theme that was already applied by the script in layout.tsx
    const root = document.documentElement
    const appliedTheme = root.classList.contains('dark') ? 'dark' : 'light'
    
    // Check for saved theme preference or use the applied theme
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    } else {
      setTheme(appliedTheme)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement
      
      // Remove existing theme classes
      root.classList.remove('light', 'dark')
      
      // Add the current theme class
      root.classList.add(theme)
      
      // Save theme preference
      localStorage.setItem('theme', theme)
      
      // Also set a data attribute for additional styling if needed
      root.setAttribute('data-theme', theme)
      
      // Add loaded class to enable transitions
      root.classList.add('loaded')
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      console.log('Theme toggled to:', newTheme) // Debug log
      return newTheme
    })
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  const contextValue = {
    theme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
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

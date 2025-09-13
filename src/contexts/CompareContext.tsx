'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from './CartContext'

type CompareContextType = {
  compared: Product[]
  addToCompare: (product: Product) => void
  removeFromCompare: (productId: string) => void
  isInCompare: (productId: string) => boolean
  clearCompare: () => void
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compared, setCompared] = useState<Product[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mwell_compare')
      if (saved) {
        setCompared(JSON.parse(saved))
      }
    } catch {}
    setIsHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('mwell_compare', JSON.stringify(compared))
    window.dispatchEvent(new CustomEvent('compareUpdated'))
  }, [compared, isHydrated])

  const addToCompare = (product: Product) => {
    setCompared(prev => {
      if (prev.some(p => p.id === product.id)) return prev
      return [...prev, product]
    })
  }

  const removeFromCompare = (productId: string) => {
    setCompared(prev => prev.filter(p => p.id !== productId))
  }

  const isInCompare = (productId: string) => compared.some(p => p.id === productId)

  const clearCompare = () => setCompared([])

  return (
    <CompareContext.Provider value={{ compared, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}



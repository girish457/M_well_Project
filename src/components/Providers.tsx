'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { CompareProvider } from '@/contexts/CompareContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

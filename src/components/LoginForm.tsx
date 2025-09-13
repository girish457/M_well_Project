'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
// Removed useAuth import - will use props instead

interface LoginFormProps {
  onSwitchToSignup: () => void
  onSuccess?: () => void
  onLogin?: (email: string, password: string) => Promise<boolean>
  notice?: string
}

export default function LoginForm({ onSwitchToSignup, onSuccess, onLogin, notice }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (onLogin) {
        const success = await onLogin(formData.email, formData.password)
        if (success) {
          onSuccess?.()
        } else {
          setError('Invalid email or password. Please try again.')
        }
      } else {
        // Fallback to direct API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (response.ok) {
          try {
            const data = await response.json()
            if (data?.user) {
              try { localStorage.setItem('mwell_user', JSON.stringify(data.user)) } catch {}
            }
          } catch {}
          onSuccess?.()
        } else {
          const data = await response.json()
          setError(data?.error || 'Invalid email or password. Please try again.')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to M-Well</h2>
          <p className="text-gray-600 mt-1">Login your account</p>
        </div>

        {notice && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-700 text-sm font-medium">{notice}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-3 rounded-full bg-purple-50 placeholder-purple-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Username"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-12 pr-12 py-3 rounded-full bg-purple-50 placeholder-purple-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-purple-500 hover:text-purple-600" />
                ) : (
                  <Eye className="h-5 w-5 text-purple-500 hover:text-purple-600" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">Forgot password?</button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Dont have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
// Removed useAuth import - will use props instead

interface SignupFormProps {
  onSwitchToLogin: () => void
  onSuccess?: () => void
  onSignup?: (userData: any) => Promise<boolean>
}

export default function SignupForm({ onSwitchToLogin, onSuccess, onSignup }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      if (onSignup) {
        const success = await onSignup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })
        
        if (success) {
          onSuccess?.()
        } else {
          setError('Failed to create account. Please try again.')
        }
      } else {
        // Fallback to direct API call
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          })
        })
        
        if (response.ok) {
          onSuccess?.()
        } else {
          const data = await response.json()
          setError(data?.error || 'Failed to create account. Please try again.')
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
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Become M-Well family member</h2>
          <p className="text-gray-600">Signup your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-purple-500" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-3 rounded-full bg-purple-50 placeholder-purple-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Username"
              />
            </div>
          </div>

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
                placeholder="Email"
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

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-500" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-12 pr-12 py-3 rounded-full bg-purple-50 placeholder-purple-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showConfirmPassword ? (
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
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { User, Calendar, Phone, Mail, MapPin, Clock, CheckCircle, LogOut, Pencil, Star, Heart } from 'lucide-react'
import EditAppointmentModal from '@/components/EditAppointmentModal'
import LoginForm from '@/components/LoginForm'
import SignupForm from '@/components/SignupForm'
import ReviewsTab from '@/components/ReviewsTab'
import WishlistTab from '@/components/WishlistTab'
import { getUserId } from '@/lib/auth-utils'

export default function Account() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showSignup, setShowSignup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [appointments, setAppointments] = useState<any[]>([])
  const [editing, setEditing] = useState<{ open: boolean; appt: any | null }>({ open: false, appt: null })
  const [editTimeRemaining, setEditTimeRemaining] = useState<number | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'appointments' | 'reviews' | 'wishlist'>('appointments')
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Live timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem('mwell_user', JSON.stringify(data.user))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (userData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem('mwell_user', JSON.stringify(data.user))
        return true
      }
      return false
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('mwell_user')
  }

  const loadAppointments = async () => {
    try {
      const userToken = localStorage.getItem('mwell_user')
      if (!userToken) {
        // Fallback to localStorage for non-authenticated users
        const raw = localStorage.getItem('appointments')
        const list = raw ? JSON.parse(raw) : []
        setAppointments(Array.isArray(list) ? list.slice(0, 7) : [])
        return
      }

      const userData = JSON.parse(userToken)

      // Fetch from database
      const response = await fetch('/api/v2/appointments', {
        headers: {
          'Authorization': `Bearer ${userData.email || ''}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments || [])
      } else {
        // Fallback to localStorage
        const raw = localStorage.getItem('appointments')
        const list = raw ? JSON.parse(raw) : []
        setAppointments(Array.isArray(list) ? list.slice(0, 7) : [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      // Fallback to localStorage
      const raw = localStorage.getItem('appointments')
      const list = raw ? JSON.parse(raw) : []
      setAppointments(Array.isArray(list) ? list.slice(0, 7) : [])
    }
  }

  // Check for existing session on mount and load appointments
  React.useEffect(() => {
    const savedUser = localStorage.getItem('mwell_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('mwell_user')
      }
    }
    loadAppointments()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'appointments') loadAppointments()
    }
    const onVisibility = () => { if (document.visibilityState === 'visible') loadAppointments() }
    const onFocus = () => loadAppointments()
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  // Persist appointments when changed
  React.useEffect(() => {
    try {
      localStorage.setItem('appointments', JSON.stringify(appointments.slice(0, 7)))
    } catch {}
  }, [appointments])

  const secondsLeftToEdit = (createdAtIso: string): number => {
    const created = new Date(createdAtIso).getTime()
    const now = currentTime // Use live currentTime instead of Date.now()
    const diffSec = Math.floor((now - created) / 1000)
    const windowSec = 30 * 60
    return Math.max(0, windowSec - diffSec)
  }

  const openEdit = (appt: any) => {
    const left = secondsLeftToEdit(appt.createdAt)
    setEditTimeRemaining(left)
    setEditing({ open: true, appt })
  }

  const closeEdit = () => {
    setEditing({ open: false, appt: null })
    setEditTimeRemaining(undefined)
  }

  const handleSaveAppointment = (updated: any) => {
    setAppointments((prev) => {
      const next = prev.map((a) => (a.id === updated.id ? { ...updated } : a))
      return next.slice(0, 7)
    })
    // Refresh appointments from database
    loadAppointments()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {showSignup ? 'Create Account' : 'Sign In'}
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                {showSignup 
                  ? 'Join M-Well Healthcare to manage your appointments and health information'
                  : 'Sign in to access your account and manage your appointments'
                }
              </p>
            </div>
          </div>
        </section>


        {/* Auth Form Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {showSignup ? (
              <SignupForm 
                onSwitchToLogin={() => setShowSignup(false)}
                onSuccess={() => setShowSignup(false)}
                onSignup={handleSignup}
              />
            ) : (
              <LoginForm 
                onSwitchToSignup={() => setShowSignup(true)}
                onSuccess={() => {}}
                onLogin={handleLogin}
              />
            )}
            {/* Social Auth */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50"
                onClick={async ()=>{
                  try {
                    const res = await fetch('/api/auth/social', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ provider:'google', email: user?.email || `user${Date.now()}@example.com`, name: user?.name || 'Google User' }) })
                    if (res.ok) {
                      const data = await res.json()
                      localStorage.setItem('mwell_user', JSON.stringify(data.user))
                      setUser(data.user)
                      setIsAuthenticated(true)
                    }
                  } catch {}
                }}
              >
                Continue with Google
              </button>
              <button
                type="button"
                className="w-full border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50"
                onClick={async ()=>{
                  try {
                    const res = await fetch('/api/auth/social', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ provider:'facebook', email: user?.email || `user${Date.now()}@example.com`, name: user?.name || 'Facebook User' }) })
                    if (res.ok) {
                      const data = await res.json()
                      localStorage.setItem('mwell_user', JSON.stringify(data.user))
                      setUser(data.user)
                      setIsAuthenticated(true)
                    }
                  } catch {}
                }}
              >
                Continue with Facebook
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              My Account
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Welcome back, {user?.name}! Manage your appointments and account information
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user?.name}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-400">Your account information</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700 dark:text-gray-400">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700 dark:text-gray-400">Jaipur, Rajasthan</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'appointments'
                        ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-600'
                        : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'reviews'
                        ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-600'
                        : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <Star className="h-5 w-5" />
                    <span>Reviews</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'wishlist'
                        ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-600'
                        : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Wishlist</span>
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'appointments' && (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <Calendar className="h-6 w-6 text-primary-600" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Appointments</h2>
                    </div>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Appointments Yet</h3>
                    <p className="text-gray-700 dark:text-gray-400 mb-6">You haven&apos;t booked any appointments yet.</p>
                    <a 
                      href="/appointments" 
                      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Book Your First Appointment
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.slice(0,7).map((appt) => {
                      const leftSec = secondsLeftToEdit(appt.createdAt)
                      const canEdit = leftSec > 0
                      const minutes = Math.floor(leftSec / 60)
                      const seconds = String(leftSec % 60).padStart(2, '0')
                      return (
                        <div key={appt.id || appt.appointmentNumber} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Appointment #{appt.appointmentNumber || appt.id}</div>
                            <div className="text-gray-900 dark:text-gray-100 font-semibold">{appt.firstName} {appt.lastName}</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">{appt.date} at {appt.time}</div>
                            {appt.product && <div className="text-sm text-gray-700 dark:text-gray-300">Product: {appt.product}</div>}
                            {appt.expert && <div className="text-sm text-gray-700 dark:text-gray-300">Expert: {appt.expert}</div>}
                          </div>
                          <div className="flex items-center gap-3">
                            {canEdit ? (
                              <button
                                onClick={() => openEdit(appt)}
                                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit ({minutes}:{seconds})
                              </button>
                            ) : (
                              <button
                                disabled
                                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                                title="Editing allowed for 30 minutes after booking"
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit (expired)
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                  </div>
                )}

                

                {activeTab === 'reviews' && (
                  <ReviewsTab userId={getUserId() || user?.id || ''} />
                )}

                {activeTab === 'wishlist' && (
                  <WishlistTab userId={getUserId() || user?.id || ''} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Appointment Modal */}
      {editing.appt && (
        <EditAppointmentModal
          appointment={editing.appt}
          isOpen={editing.open}
          onClose={closeEdit}
          onSave={handleSaveAppointment}
          canEdit={(editTimeRemaining ?? secondsLeftToEdit(editing.appt.createdAt)) > 0}
          timeRemaining={editTimeRemaining}
        />
      )}
    </div>
  )
}
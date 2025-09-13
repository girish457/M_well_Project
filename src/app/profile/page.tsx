'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, Pencil } from 'lucide-react'

export default function Profile() {
  const [appointments, setAppointments] = useState<Array<any>>([])
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(Date.now())

  const fetchAppointments = async () => {
    try {
      const userToken = localStorage.getItem('mwell_user')
      if (!userToken) {
        // Fallback to localStorage for non-authenticated users
        const raw = window.localStorage.getItem('appointments')
        const list = raw ? JSON.parse(raw) : []
        setAppointments(Array.isArray(list) ? list : [])
        setIsLoading(false)
        return
      }

      const userData = JSON.parse(userToken)
      setUser(userData)

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
        const raw = window.localStorage.getItem('appointments')
        const list = raw ? JSON.parse(raw) : []
        setAppointments(Array.isArray(list) ? list : [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      // Fallback to localStorage
      const raw = window.localStorage.getItem('appointments')
      const list = raw ? JSON.parse(raw) : []
      setAppointments(Array.isArray(list) ? list : [])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsClient(true)
    fetchAppointments()
  }, [])

  // Live timer for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

  const secondsLeftToEdit = (createdAtIso: string): number => {
    const created = new Date(createdAtIso).getTime()
    const now = currentTime // Use live currentTime instead of Date.now()
    const diffSec = Math.floor((now - created) / 1000)
    const windowSec = 30 * 60
    return Math.max(0, windowSec - diffSec)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold">My Appointments</h2>
            </div>
            
            {!isClient || isLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Appointments Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You haven&apos;t booked any appointments yet.</p>
                <a 
                  href="/appointments" 
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Book Your First Appointment
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 7).map((appt) => {
                  const leftSec = secondsLeftToEdit(appt.createdAt)
                  const canEdit = leftSec > 0
                  const minutes = Math.floor(leftSec / 60)
                  const seconds = String(leftSec % 60).padStart(2, '0')
                  return (
                    <div key={appt.id || appt.appointmentNumber} className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Appointment #{appt.appointmentNumber || appt.id}</div>
                        <div className="text-gray-900 dark:text-gray-100 font-semibold">{appt.firstName} {appt.lastName}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{appt.date} at {appt.time}</div>
                        {appt.product && <div className="text-sm text-gray-700 dark:text-gray-300">Product: {appt.product}</div>}
                        {appt.expert && <div className="text-sm text-gray-700 dark:text-gray-300">Expert: {appt.expert}</div>}
                      </div>
                      <div className="flex items-center gap-3">
                        {canEdit ? (
                          <button
                            onClick={() => {
                              // TODO: Implement edit functionality for profile page
                              alert('Edit functionality will be available soon!')
                            }}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                            title="Edit appointment"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit ({minutes}:{seconds})
                          </button>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
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
        </div>
      </section>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Phone, Mail, Save, AlertCircle } from 'lucide-react'

interface Appointment {
  id: string
  createdAt: string
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  product: string
  expert: string
  reason: string
  medicalIssue?: string
  notes?: string
}

interface EditAppointmentModalProps {
  appointment: Appointment
  isOpen: boolean
  onClose: () => void
  onSave: (updatedAppointment: Appointment) => void
  canEdit: boolean
  timeRemaining?: number
}

export default function EditAppointmentModal({
  appointment,
  isOpen,
  onClose,
  onSave,
  canEdit,
  timeRemaining
}: EditAppointmentModalProps) {
  const [formData, setFormData] = useState({
    firstName: appointment.firstName,
    lastName: appointment.lastName,
    email: appointment.email,
    phone: appointment.phone,
    date: appointment.date,
    time: appointment.time,
    product: appointment.product,
    expert: appointment.expert,
    reason: appointment.reason,
    medicalIssue: appointment.medicalIssue || '',
    notes: appointment.notes || ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ]

  const products = [
    'Multi Vitamin Softgel',
    'Men Care Premium Concentrated Drink',
    'Super Herbs Veg Capsules',
    'All Clear Tablets',
    'Anti Anxiety Drops',
    'Women Care Syrup',
    'Anti Addiction Drops',
  ]

  const experts = [
    'Mrs. Poonam Rajput',
    'Mr. Laxman Yadav',
    'Mrs. Deepa Sidhnani',
  ]

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: appointment.firstName,
        lastName: appointment.lastName,
        email: appointment.email,
        phone: appointment.phone,
        date: appointment.date,
        time: appointment.time,
        product: appointment.product,
        expert: appointment.expert,
        reason: appointment.reason,
        medicalIssue: appointment.medicalIssue || '',
        notes: appointment.notes || ''
      })
      setError('')
    }
  }, [isOpen, appointment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
          !formData.date || !formData.time || !formData.product || !formData.reason) {
        setError('Please fill in all required fields')
        return
      }

      // Try to update in database first
      const userToken = localStorage.getItem('mwell_user')
      if (userToken) {
        const userData = JSON.parse(userToken)
        const response = await fetch(`/api/v2/appointments/${appointment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.email || ''}`
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: formData.time,
            product: formData.product,
            expert: formData.expert,
            reason: formData.reason,
            medicalIssue: formData.medicalIssue,
            notes: formData.notes
          })
        })

        if (response.ok) {
          const data = await response.json()
          onSave(data.appointment)
          onClose()
          return
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to update appointment')
          return
        }
      }

      // Fallback to localStorage update
      const updatedAppointment: Appointment = {
        ...appointment,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        product: formData.product,
        expert: formData.expert,
        reason: formData.reason,
        medicalIssue: formData.medicalIssue,
        notes: formData.notes
      }

      onSave(updatedAppointment)
      onClose()
    } catch (error) {
      setError('Failed to update appointment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Appointment</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Time Warning */}
        {!canEdit && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">
                <strong>Edit time expired!</strong> You can only edit appointments within 30 minutes of booking.
              </p>
            </div>
          </div>
        )}

        {canEdit && timeRemaining && timeRemaining > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-yellow-700">
                <strong>Time remaining to edit:</strong> {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <User className="h-5 w-5 text-primary-600 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-primary-600 mr-2" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time *
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product *
                </label>
                <select
                  id="product"
                  name="product"
                  required
                  value={formData.product}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="expert" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expert
                </label>
                <select
                  id="expert"
                  name="expert"
                  value={formData.expert}
                  onChange={handleChange}
                  disabled={!canEdit || !formData.product}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select an expert</option>
                  {experts.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Visit *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Medical Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="medicalIssue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medical Issue (optional)
                </label>
                <input
                  type="text"
                  id="medicalIssue"
                  name="medicalIssue"
                  value={formData.medicalIssue}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canEdit || isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

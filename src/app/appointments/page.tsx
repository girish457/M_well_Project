'use client'

import React, { useState } from 'react'
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, ArrowRight } from 'lucide-react'

export default function Appointments() {
  const [currentStep, setCurrentStep] = useState(1)
  const [appointmentNumber, setAppointmentNumber] = useState<string | null>(null)
  const [highlightField, setHighlightField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    product: '',
    expert: '',
    reason: '',
    insurance: '',
    notes: ''
  })

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (highlightField === e.target.name) {
      setHighlightField(null)
    }
  }

  // Helpers for per-step required fields
  const getMissingFieldsForStep = (step: number): string[] => {
    if (step === 1) {
      return ['firstName', 'lastName', 'email', 'phone'].filter((k) => (formData as any)[k].trim() === '')
    }
    if (step === 2) {
      return ['date', 'time', 'product', 'reason'].filter((k) => (formData as any)[k].trim() === '')
    }
    return []
  }

  // Validation helpers for step gating
  const isStepValid = (step: number): boolean => {
    if (step === 1) {
      return (
        formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.phone.trim() !== ''
      )
    }
    if (step === 2) {
      return (
        formData.date.trim() !== '' &&
        formData.time.trim() !== '' &&
        formData.product.trim() !== '' &&
        formData.reason.trim() !== ''
      )
    }
    if (step === 3) {
      // Step 3 fields are optional; step considered valid by default
      return true
    }
    // Step 4 is confirmation; validity depends on prior steps
    return isStepValid(1) && isStepValid(2)
  }

  const arePrerequisitesComplete = (targetStep: number): boolean => {
    // Ensure all steps before targetStep are valid
    for (let s = 1; s < targetStep; s += 1) {
      if (!isStepValid(s)) return false
    }
    return true
  }

  const departments = [
    { id: 'general', name: 'General Medicine', doctors: ['Dr. Sarah Johnson', 'Dr. Michael Brown'] },
    { id: 'cardiology', name: 'Cardiology', doctors: ['Dr. Michael Chen', 'Dr. Lisa Wang'] },
    { id: 'pediatrics', name: 'Pediatrics', doctors: ['Dr. Emily Rodriguez', 'Dr. James Wilson'] },
    { id: 'orthopedics', name: 'Orthopedics', doctors: ['Dr. David Thompson', 'Dr. Maria Garcia'] },
    { id: 'dermatology', name: 'Dermatology', doctors: ['Dr. Jennifer Lee', 'Dr. Robert Kim'] },
    { id: 'ophthalmology', name: 'Ophthalmology', doctors: ['Dr. Amanda Taylor', 'Dr. Kevin Park'] }
  ]

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear highlight when this field is filled
    const { name, value } = e.target
    if (highlightField === name && value.trim() !== '') {
      setHighlightField(null)
    }
  }

  const handleNext = () => {
    // Block moving forward unless current step is valid
    if (!isStepValid(currentStep)) {
      const missing = getMissingFieldsForStep(currentStep)
      if (missing.length > 0) setHighlightField(missing[0])
      return
    }
    if (currentStep < 4) {
      const next = currentStep + 1
      setCurrentStep(next)
      if (next === 4 && !appointmentNumber) {
        const unique = '7790' + Math.floor(100000 + Math.random() * 900000).toString()
        setAppointmentNumber(unique)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure appointment number exists
    const ensuredNumber = appointmentNumber ?? ('7790' + Math.floor(100000 + Math.random() * 900000).toString())
    if (!appointmentNumber) setAppointmentNumber(ensuredNumber)

    try {
      // Get user token from localStorage
      const userToken = typeof window !== 'undefined' ? localStorage.getItem('mwell_user') : null
      if (!userToken) {
        // If no user is logged in, save to localStorage as fallback
        const appointmentRecord = {
          id: ensuredNumber,
          createdAt: new Date().toISOString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          product: formData.product,
          expert: formData.expert,
          reason: formData.reason,
          medicalIssue: formData.insurance,
          notes: formData.notes,
        }
        const existingRaw = typeof window !== 'undefined' ? window.localStorage.getItem('appointments') : null
        const existing = existingRaw ? JSON.parse(existingRaw) : []
        const nextList = [appointmentRecord, ...existing].slice(0, 7)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('appointments', JSON.stringify(nextList))
        }
        setIsSubmitted(true)
        return
      }

      // Save to database for logged-in users
      const response = await fetch('/api/v2/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(userToken).email || ''}`
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
          medicalIssue: formData.insurance,
          notes: formData.notes,
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        // Fallback to localStorage if database save fails
        const appointmentRecord = {
          id: ensuredNumber,
          createdAt: new Date().toISOString(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          product: formData.product,
          expert: formData.expert,
          reason: formData.reason,
          medicalIssue: formData.insurance,
          notes: formData.notes,
        }
        const existingRaw = typeof window !== 'undefined' ? window.localStorage.getItem('appointments') : null
        const existing = existingRaw ? JSON.parse(existingRaw) : []
        const nextList = [appointmentRecord, ...existing].slice(0, 7)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('appointments', JSON.stringify(nextList))
        }
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Error saving appointment:', error)
      // Fallback to localStorage
      const appointmentRecord = {
        id: ensuredNumber,
        createdAt: new Date().toISOString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        product: formData.product,
        expert: formData.expert,
        reason: formData.reason,
        medicalIssue: formData.insurance,
        notes: formData.notes,
      }
      const existingRaw = typeof window !== 'undefined' ? window.localStorage.getItem('appointments') : null
      const existing = existingRaw ? JSON.parse(existingRaw) : []
      const nextList = [appointmentRecord, ...existing].slice(0, 7)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('appointments', JSON.stringify(nextList))
      }
      setIsSubmitted(true)
    }
  }

  const jumpToStep = (step: number) => {
    if (step < 1 || step > 4) return
    // Always allow jumping backward (including from step 4 to any previous)
    if (step <= currentStep) {
      setCurrentStep(step)
      return
    }
    // For jumping forward, require all prerequisite steps to be complete
    if (arePrerequisitesComplete(step)) {
      setCurrentStep(step)
      if (step === 4 && !appointmentNumber) {
        const unique = '7790' + Math.floor(100000 + Math.random() * 900000).toString()
        setAppointmentNumber(unique)
      }
    } else {
      // Find first incomplete prerequisite step and mark its field errors
      for (let s = 1; s < step; s += 1) {
        if (!isStepValid(s)) {
          const missing = getMissingFieldsForStep(s)
          if (missing.length > 0) setHighlightField(missing[0])
          break
        }
      }
    }
  }

  const canJumpTo = (step: number): boolean => {
    if (step <= currentStep) return true
    return arePrerequisitesComplete(step)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book an Appointment
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Schedule your visit with our expert medical team. 
              We&apos;re here to provide the care you need when you need it.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => jumpToStep(step)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-transform hover:scale-105 ${
                        step <= currentStep 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:shadow'
                      }`}
                      aria-label={`Go to step ${step}`}
                    >
                      {step}
                    </button>
                    {step < 4 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step < currentStep ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              {/* Removed global step warning */}
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <button type="button" onClick={() => jumpToStep(1)} className="hover:text-primary-700">Personal Info</button>
                <button type="button" onClick={() => jumpToStep(2)} className="hover:text-primary-700">Appointment Details</button>
                <button type="button" onClick={() => jumpToStep(3)} className="hover:text-primary-700">Medical Info</button>
                <button type="button" onClick={() => jumpToStep(4)} className="hover:text-primary-700">Confirmation</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'firstName' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                          placeholder="Enter your first name"
                          onFocus={handleFocus}
                        />
                        {highlightField === 'firstName' && (
                          <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                            Please fill this section
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'lastName' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                          placeholder="Enter your last name"
                          onFocus={handleFocus}
                        />
                        {highlightField === 'lastName' && (
                          <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                            Please fill this section
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'email' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                          placeholder="your.email@example.com"
                          onFocus={handleFocus}
                        />
                        {highlightField === 'email' && (
                          <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                            Please fill this section
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'phone' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                          placeholder="(555) 123-4567"
                          onFocus={handleFocus}
                        />
                        {highlightField === 'phone' && (
                          <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                            Please fill this section
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Appointment Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Appointment Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'date' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                        />
                        {highlightField === 'date' && (
                          <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                            Please fill this section
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <select
                          id="time"
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'time' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                          onFocus={handleFocus}
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        {highlightField === 'time' && (
                          <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                            Please fill this section
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Name *
                      </label>
                      <div className="relative">
                        <select
                          id="product"
                          name="product"
                          required
                          value={formData.product}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'product' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                          onFocus={handleFocus}
                        >
                          <option value="">Select a product</option>
                          {products.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        {highlightField === 'product' && (
                          <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                            Please fill this section
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="expert" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Expert
                      </label>
                      <select
                        id="expert"
                        name="expert"
                        value={formData.expert}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        disabled={!formData.product}
                      >
                        <option value="">Select an expert</option>
                        {experts.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for Visit *
                    </label>
                    <div className="relative">
                      <textarea
                        id="reason"
                        name="reason"
                        required
                        rows={4}
                        value={formData.reason}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${highlightField === 'reason' ? 'border-red-500 animate-pulse' : 'border-gray-300 dark:border-gray-600'}`}
                        placeholder="Please describe the reason for your visit..."
                        onFocus={handleFocus}
                      />
                      {highlightField === 'reason' && (
                        <div className="absolute -bottom-10 left-0 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 text-xs px-3 py-2 rounded shadow animate-bounce">
                          Please fill this section
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Medical Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Medical Info</h2>
                  
                  <div>
                    <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medical Issue <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="insurance"
                      name="insurance"
                      value={formData.insurance}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Enter name of disease you have"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Information about disease <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="Any additional information you'd like to share..."
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Important Reminders</h3>
                    <ul className="text-blue-700 dark:text-blue-200 space-y-1">
                      <li>• Please arrive 15 minutes before your appointment</li>
                      <li>• Bring a screenshot or note of your appointment number</li>
                      <li>• Bring your any recently medical checkup certificate</li>
                      <li>• If you need to reschedule, please call at least 24 hours in advance</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation - Shows first */}
              {currentStep === 4 && !isSubmitted && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-accent-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Confirm Your Appointment</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please review your appointment details before confirming.</p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                          <User className="h-5 w-5 mr-2 text-primary-600" />
                          Customer Information
                        </h3>
                        <div className="space-y-2">
                          <p className="text-gray-600 dark:text-gray-300 font-medium">{formData.firstName} {formData.lastName}</p>
                          <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                          <p className="text-gray-600 dark:text-gray-400">{formData.phone}</p>
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                          Appointment Details
                        </h3>
                        <div className="space-y-2">
                          <p className="text-gray-600 dark:text-gray-300 font-medium">{formData.date} at {formData.time}</p>
                          {formData.product && <p className="text-gray-600 dark:text-gray-400">{formData.product}</p>}
                          {formData.expert && <p className="text-gray-600 dark:text-gray-400">{formData.expert}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-accent-600" />
                        Appointment Number
                      </h3>
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{appointmentNumber}</p>
                    </div>
                    {(formData.insurance || formData.notes) && (
                      <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Medical Info</h3>
                        <div className="space-y-2">
                          {formData.insurance && <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Medical Issue:</span> {formData.insurance}</p>}
                          {formData.notes && <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">Information:</span> {formData.notes}</p>}
                        </div>
                      </div>
                    )}
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Reason for Visit</h3>
                      <p className="text-gray-600 dark:text-gray-400">{formData.reason}</p>
                    </div>
                  </div>

                  {/* Confirmation Button */}
                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto text-lg"
                    >
                      <CheckCircle className="mr-3 h-6 w-6" />
                      Confirmation
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Click to confirm and submit your appointment</p>
                  </div>
                </div>
              )}

              {/* Thank You Message - Shows ONLY after clicking Confirm */}
              {isSubmitted && (
                <div className="space-y-6 text-center py-10">
                  <CheckCircle className="h-16 w-16 text-accent-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Thank you! Your appointment is confirmed.</h2>
                  <p className="text-gray-700 dark:text-gray-300">Appointment Number: <span className="font-semibold">{appointmentNumber}</span></p>
                  <div className="flex justify-center gap-4 pt-4">
                    <a href="/account" className="btn-primary">View in Profile</a>
                    <a href="/appointments" className="px-6 py-3 rounded-lg font-medium bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300">Book Another</a>
                  </div>
                </div>
              )}

              {/* Navigation Buttons - Only show if not submitted */}
              {!isSubmitted && (
                <div className="flex justify-between pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-lg font-medium ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {currentStep < 4 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary flex items-center"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
              </>
            </form>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Need Immediate Care?</h2>
          <p className="text-red-700 mb-6">
            For medical emergencies, please call our 24/7 emergency line immediately.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <Phone className="h-6 w-6 text-red-600" />
            <span className="text-3xl font-bold text-red-800">1800-891-2871</span>
          </div>
        </div>
      </section>
    </div>
  )
}

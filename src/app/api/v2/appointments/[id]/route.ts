import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/storage'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'user-data')
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json')

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Initialize appointments file
const initializeAppointments = () => {
  ensureDataDir()
  if (!fs.existsSync(APPOINTMENTS_FILE)) {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify([], null, 2))
  }
}

// Get all appointments
const getAllAppointments = () => {
  initializeAppointments()
  try {
    const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading appointments:', error)
    return []
  }
}

// Update appointment
const updateAppointment = (appointmentId: string, updates: any) => {
  initializeAppointments()
  try {
    const appointments = getAllAppointments()
    const appointmentIndex = appointments.findIndex((apt: any) => apt.id === appointmentId)
    
    if (appointmentIndex === -1) return null
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2))
    return appointments[appointmentIndex]
  } catch (error) {
    console.error('Error updating appointment:', error)
    return null
  }
}

// Delete appointment
const deleteAppointment = (appointmentId: string) => {
  initializeAppointments()
  try {
    const appointments = getAllAppointments()
    const filteredAppointments = appointments.filter((apt: any) => apt.id !== appointmentId)
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(filteredAppointments, null, 2))
    return true
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return false
  }
}

function requireAuth(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  
  if (!token) return null
  
  try {
    const user = getUserByEmail(token)
    if (!user) return null
    
    return {
      sub: user.id,
      email: user.email,
      role: user.role
    }
  } catch (error) {
    return null
  }
}

// PUT /api/v2/appointments/[id] - Update appointment
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const appointmentId = params.id
    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      product,
      expert,
      reason,
      medicalIssue,
      notes
    } = await req.json()

    // Check if appointment exists and belongs to user
    const appointments = getAllAppointments()
    const existingAppointment = appointments.find((apt: any) => 
      apt.id === appointmentId && apt.userId === user.sub
    )

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Check if appointment can still be edited (within 30 minutes)
    const createdAt = new Date(existingAppointment.createdAt)
    const now = new Date()
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60)

    if (diffMinutes > 30) {
      return NextResponse.json({ error: 'Appointment can only be edited within 30 minutes of booking' }, { status: 400 })
    }

    // Update appointment
    const updatedAppointment = updateAppointment(appointmentId, {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      product,
      expert: expert || null,
      reason,
      medicalIssue: medicalIssue || null,
      notes: notes || null
    })

    if (!updatedAppointment) {
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Appointment updated successfully',
      appointment: updatedAppointment 
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

// DELETE /api/v2/appointments/[id] - Delete appointment
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const appointmentId = params.id

    // Check if appointment exists and belongs to user
    const appointments = getAllAppointments()
    const existingAppointment = appointments.find((apt: any) => 
      apt.id === appointmentId && apt.userId === user.sub
    )

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Delete appointment
    const success = deleteAppointment(appointmentId)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}

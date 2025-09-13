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

// Get appointments for a user
const getUserAppointments = (userId: string) => {
  initializeAppointments()
  try {
    const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8')
    const appointments = JSON.parse(data)
    return appointments.filter((apt: any) => apt.userId === userId)
  } catch (error) {
    console.error('Error reading appointments:', error)
    return []
  }
}

// Save appointment
const saveAppointment = (appointment: any) => {
  initializeAppointments()
  try {
    const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8')
    const appointments = JSON.parse(data)
    appointments.push(appointment)
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2))
    return appointment
  } catch (error) {
    console.error('Error saving appointment:', error)
    throw error
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

// GET /api/v2/appointments - Get user's appointments (last 7)
export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const appointments = getUserAppointments(user.sub)
    
    // Cleanup: Keep only the last 7 appointments for this user
    if (appointments.length > 7) {
      const appointmentsToKeep = appointments
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 7)
      
      // Update the file with only the last 7 appointments
      const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8')
      const allAppointmentsInFile = JSON.parse(data)
      const updatedAppointments = allAppointmentsInFile.filter((apt: any) => 
        apt.userId !== user.sub || appointmentsToKeep.some((keep: any) => keep.id === apt.id)
      )
      fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(updatedAppointments, null, 2))
      
      // Return the cleaned appointments
      return NextResponse.json({ appointments: appointmentsToKeep })
    }
    
    // Sort by creation date (newest first)
    const sortedAppointments = appointments
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ appointments: sortedAppointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

// POST /api/v2/appointments - Create new appointment
export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
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

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !date || !time || !product || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique appointment number
    const appointmentNumber = '7790' + Math.floor(100000 + Math.random() * 900000).toString()

    // Create appointment object
    const appointment = {
      id: Date.now().toString(),
      appointmentNumber,
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
      notes: notes || null,
      userId: user.sub,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save appointment
    const savedAppointment = saveAppointment(appointment)

    // Keep only the last 7 appointments for this user
    const allAppointments = getUserAppointments(user.sub)
    if (allAppointments.length > 7) {
      const appointmentsToKeep = allAppointments
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 7)
      
      // Update the file with only the last 7 appointments
      initializeAppointments()
      const data = fs.readFileSync(APPOINTMENTS_FILE, 'utf8')
      const allAppointmentsInFile = JSON.parse(data)
      const updatedAppointments = allAppointmentsInFile.filter((apt: any) => 
        apt.userId !== user.sub || appointmentsToKeep.some((keep: any) => keep.id === apt.id)
      )
      fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(updatedAppointments, null, 2))
    }

    return NextResponse.json({ 
      message: 'Appointment created successfully',
      appointment: savedAppointment 
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}

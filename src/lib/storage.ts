import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'user-data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export interface User {
  id: string
  email: string
  name: string
  password: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  appointments: number
}

export interface StoredUser {
  id: string
  email: string
  name: string
  password: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

// Initialize with default admin user
const initializeUsers = () => {
  ensureDataDir()
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers: StoredUser[] = [
      {
        id: '1',
        email: 'admin@mwell.com',
        name: 'Admin User',
        password: 'admin123', // In real app, this would be hashed
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      }
    ]
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2))
  }
}

// Get all users
export const getUsers = (): User[] => {
  initializeUsers()
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    const users: StoredUser[] = JSON.parse(data)
    return users.map(user => ({
      ...user,
      appointments: Math.floor(Math.random() * 5) // Mock appointment count
    }))
  } catch (error) {
    console.error('Error reading users:', error)
    return []
  }
}

// Get user by email
export const getUserByEmail = (email: string): StoredUser | null => {
  initializeUsers()
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    const users: StoredUser[] = JSON.parse(data)
    return users.find(user => user.email === email) || null
  } catch (error) {
    console.error('Error reading user:', error)
    return null
  }
}

// Create new user
export const createUser = (userData: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser => {
  ensureDataDir()
  initializeUsers()
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    const users: StoredUser[] = JSON.parse(data)
    
    const newUser: StoredUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Update user
export const updateUser = (id: string, updates: Partial<StoredUser>): StoredUser | null => {
  ensureDataDir()
  initializeUsers()
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    const users: StoredUser[] = JSON.parse(data)
    
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return null
    
    users[userIndex] = { ...users[userIndex], ...updates }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
    return users[userIndex]
  } catch (error) {
    console.error('Error updating user:', error)
    return null
  }
}

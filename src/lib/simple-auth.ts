import { getUserByEmail, createUser, type StoredUser } from './storage'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

export const authenticateUser = (email: string, password: string): AuthUser | null => {
  const user = getUserByEmail(email)
  if (!user || user.password !== password) {
    return null
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }
}

export const registerUser = (userData: {
  email: string
  password: string
  firstName: string
  lastName?: string
  phone?: string
}): AuthUser | null => {
  try {
    const existingUser = getUserByEmail(userData.email)
    if (existingUser) {
      return null // User already exists
    }
    
    const displayName = userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.firstName
    const newUser = createUser({
      email: userData.email,
      password: userData.password,
      name: displayName,
      role: 'USER'
    })
    
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  } catch (error) {
    console.error('Registration error:', error)
    return null
  }
}


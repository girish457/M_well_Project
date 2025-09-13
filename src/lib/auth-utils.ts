// Simple utility functions for authentication

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('mwell_token') || localStorage.getItem('mwell_user')
}

export const getAuthHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' }
  
  try {
    const userData = localStorage.getItem('mwell_user')
    if (userData) {
      const user = JSON.parse(userData)
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.email}`
      }
    }
  } catch (error) {
    console.error('Error parsing user data:', error)
  }
  
  return { 'Content-Type': 'application/json' }
}

export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const userData = localStorage.getItem('mwell_user')
    if (userData) {
      const user = JSON.parse(userData)
      return user.id || user.userId || null
    }
  } catch (error) {
    console.error('Error parsing user data:', error)
  }
  return null
}

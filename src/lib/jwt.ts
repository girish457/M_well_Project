import * as jwt from 'jsonwebtoken'
import { ENV } from './env'

const JWT_SECRET = ENV.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES_IN = ENV.JWT_EXPIRES_IN || '1h'
const REFRESH_SECRET = ENV.REFRESH_SECRET || 'dev-refresh-change-me'
const REFRESH_EXPIRES_IN = ENV.REFRESH_EXPIRES_IN || '7d'

export type JwtPayload = {
  sub: string
  email: string
  role: string
}

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN })
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload
  } catch {
    return null
  }
}



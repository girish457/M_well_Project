/* Centralized environment variable access and validation. */

const isServer = typeof window === 'undefined'

function getEnv(name: string): string | undefined {
  return process.env[name]
}

function requireServer(name: string, fallback?: string): string {
  const value = getEnv(name) ?? fallback
  if (!value) {
    if (isServer) {
      // During build time, use fallback values to prevent build failures
      if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
        return fallback || ''
      }
      throw new Error(`[env] ${name} is not set`)
    }
    return ''
  }
  return value
}

function optional(name: string, defaultValue?: string): string {
  const value = getEnv(name)
  return (value && String(value)) || (defaultValue ?? '')
}

export const ENV = {
  // Server-only required vars - provide fallbacks for build time
  DATABASE_URL: requireServer('DATABASE_URL', 'mongodb://localhost:27017/mwell-build'),
  JWT_SECRET: requireServer('JWT_SECRET', 'build-time-secret-key'),
  REFRESH_SECRET: requireServer('REFRESH_SECRET', 'build-time-refresh-secret'),
  NEXTAUTH_SECRET: requireServer('NEXTAUTH_SECRET', 'build-time-nextauth-secret'),

  // Optional with defaults
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '1h'),
  REFRESH_EXPIRES_IN: optional('REFRESH_EXPIRES_IN', '7d'),
  NEXTAUTH_URL: optional('NEXTAUTH_URL'),
  OPENAI_API_KEY: optional('OPENAI_API_KEY'),

  // Client-safe
  NEXT_PUBLIC_SITE_NAME: optional('NEXT_PUBLIC_SITE_NAME', 'M-Well'),
}

export function getClientEnv() {
  return {
    NEXT_PUBLIC_SITE_NAME: ENV.NEXT_PUBLIC_SITE_NAME,
  }
}



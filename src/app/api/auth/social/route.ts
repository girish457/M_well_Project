import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/storage'
import { sendWelcomeEmailIfFirst } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { provider, email, name } = await request.json()
    if (!provider || !email) {
      return NextResponse.json({ error: 'provider and email are required' }, { status: 400 })
    }

    const normalizedName = name && typeof name === 'string' ? name : 'M-Well User'

    const existing = getUserByEmail(email)
    let user = existing
    if (!existing) {
      user = createUser({ email, password: `social:${provider}`, name: normalizedName, role: 'USER' })
      try { sendWelcomeEmailIfFirst(email) } catch {}
    }

    return NextResponse.json({
      message: 'Social auth successful',
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        role: user!.role
      }
    })
  } catch (error) {
    console.error('Social auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



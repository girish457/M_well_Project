import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const payload = { sub: user.id, email: user.email, role: user.role }
    const access = signAccessToken(payload)
    const refresh = signRefreshToken(payload)
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken: access,
      refreshToken: refresh
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



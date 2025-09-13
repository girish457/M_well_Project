import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'

const ADMIN_USERNAME = 'mwelladmin01'
const ADMIN_PASSWORD = '7790@mwelladmin'
const ADMIN_EMAIL = 'admin@mwell.local'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure an ADMIN user exists
    let user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
    if (!user) {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
      user = await prisma.user.create({ data: { name: 'M-Well Admin', email: ADMIN_EMAIL, password: hash, role: 'ADMIN' } })
    } else if (user.role !== 'ADMIN') {
      user = await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } })
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



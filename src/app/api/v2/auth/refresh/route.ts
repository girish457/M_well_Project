import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json()
    if (!refreshToken) return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const access = signAccessToken(payload)
    return NextResponse.json({ accessToken: access })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



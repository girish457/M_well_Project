import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

function requireUser(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const payload = token ? verifyAccessToken(token) : null
  return payload
}

export async function GET(req: NextRequest) {
  const payload = requireUser(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const where = payload.role === 'ADMIN' ? {} : { userId: payload.sub }
  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  const payload = requireUser(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { items, totalAmount } = await req.json()
  const order = await prisma.order.create({ data: { userId: payload.sub, items: { create: items }, totalAmount } })
  return NextResponse.json({ order })
}



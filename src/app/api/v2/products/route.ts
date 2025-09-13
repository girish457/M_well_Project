import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

function requireAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const payload = token ? verifyAccessToken(token) : null
  if (!payload || payload.role !== 'ADMIN') return null
  return payload
}

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const data = await req.json()
  const product = await prisma.product.create({ data })
  return NextResponse.json({ product })
}



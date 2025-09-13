import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserByEmail } from '@/lib/storage'
import { catalog } from '@/data/products'

function requireAuth(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const email = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  
  if (!email) {
    console.log('No email found in authorization header')
    return null
  }
  
  const user = getUserByEmail(email)
  if (!user) {
    console.log('User not found for email:', email)
    return null
  }
  
  return {
    sub: user.id,
    email: user.email,
    role: user.role
  }
}

// GET /api/v2/reviews - Get user's reviews
export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const reviews = await prisma.review.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' }
    })

    // Get product details for each review from catalog
    const reviewsWithProducts = reviews.map((review) => {
      const product = catalog.find(p => p.id === review.productId)
      return {
        id: review.id,
        productId: review.productId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        product: product
      }
    })

    return NextResponse.json({ reviews: reviewsWithProducts })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST /api/v2/reviews - Add a review
export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { productId, rating, comment } = await req.json()
    
    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product ID and rating are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if product exists in catalog
    const product = catalog.find(p => p.id === productId)
    
    if (!product) {
      console.log('Product not found in catalog:', productId)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.sub,
        productId: productId
      }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: user.sub,
        productId: productId,
        rating: rating,
        comment: comment || null
      }
    })

    return NextResponse.json({ 
      message: 'Review added successfully',
      review: {
        ...review,
        product: product
      }
    })
  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 })
  }
}

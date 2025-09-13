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

// GET /api/v2/wishlist - Get user's wishlist
export async function GET(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' }
    })

    // Get product details for each wishlist item from catalog
    const wishlistWithProducts = wishlistItems.map((item) => {
      const product = catalog.find(p => p.id === item.productId)
      return {
        id: item.id,
        productId: item.productId,
        createdAt: item.createdAt,
        product: product
      }
    })

    return NextResponse.json({ wishlist: wishlistWithProducts })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

// POST /api/v2/wishlist - Add item to wishlist
export async function POST(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) {
    console.log('Wishlist POST: Unauthorized - no user found')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { productId } = await req.json()
    console.log('Wishlist POST: Adding product', productId, 'for user', user.sub)
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists in catalog
    const product = catalog.find(p => p.id === productId)
    
    if (!product) {
      console.log('Product not found in catalog:', productId)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.sub,
          productId: productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json({ error: 'Product already in wishlist' }, { status: 409 })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.sub,
        productId: productId
      }
    })

    console.log('Wishlist POST: Successfully added product to wishlist')
    return NextResponse.json({ 
      message: 'Product added to wishlist',
      wishlistItem: {
        ...wishlistItem,
        product: product
      }
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
  }
}

// DELETE /api/v2/wishlist - Remove item from wishlist
export async function DELETE(req: NextRequest) {
  const user = requireAuth(req)
  if (!user) {
    console.log('Wishlist DELETE: Unauthorized - no user found')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { productId } = await req.json()
    console.log('Wishlist DELETE: Removing product', productId, 'for user', user.sub)
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Remove from wishlist
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.sub,
        productId: productId
      }
    })

    if (deletedItem.count === 0) {
      console.log('Wishlist DELETE: Item not found in wishlist')
      return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 })
    }

    console.log('Wishlist DELETE: Successfully removed product from wishlist')
    return NextResponse.json({ message: 'Product removed from wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
  }
}

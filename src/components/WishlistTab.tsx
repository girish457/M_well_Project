'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { catalog } from '@/data/products'
import { getAuthHeaders, getUserId } from '@/lib/auth-utils'

interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    discount?: number
    image: string
    description: string
    category: string
  } | null
}

interface WishlistTabProps {
  userId: string
}

export default function WishlistTab({ userId }: WishlistTabProps) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v2/wishlist', {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist || [])
      } else {
        console.error('Failed to fetch wishlist')
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemoving(productId)
      const response = await fetch('/api/v2/wishlist', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId })
      })
      
      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.productId !== productId))
      } else {
        console.error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemoving(null)
    }
  }

  const getProductFromCatalog = (productId: string) => {
    return catalog.find(p => p.id === productId)
  }

  useEffect(() => {
    if (userId) {
      fetchWishlist()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your wishlist...</span>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Wishlist is Empty</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Start adding products you love to your wishlist!</p>
        <Link 
          href="/shop" 
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Your Wishlist ({wishlist.length} items)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const catalogProduct = getProductFromCatalog(item.productId)
          const product = item.product || catalogProduct
          
          if (!product) return null

          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <Link href={`/product/${item.productId}`}>
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  disabled={removing === item.productId}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  {removing === item.productId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h4>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.discount && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/product/${item.productId}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Product
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

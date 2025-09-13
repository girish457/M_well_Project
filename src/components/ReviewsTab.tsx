'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ExternalLink, Loader2, MessageSquare } from 'lucide-react'
import { catalog } from '@/data/products'
import { getAuthHeaders, getUserId } from '@/lib/auth-utils'

interface ReviewItem {
  id: string
  productId: string
  rating: number
  comment: string | null
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

interface ReviewsTabProps {
  userId: string
}

export default function ReviewsTab({ userId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v2/reviews', {
        headers: getAuthHeaders()
      })
      
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      } else {
        console.error('Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductFromCatalog = (productId: string) => {
    return catalog.find(p => p.id === productId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  useEffect(() => {
    if (userId) {
      fetchReviews()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading your reviews...</span>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You haven&apos;t reviewed any products yet. Share your experience!</p>
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
          Your Reviews ({reviews.length} reviews)
        </h3>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => {
          const catalogProduct = getProductFromCatalog(review.productId)
          const product = review.product || catalogProduct
          
          if (!product) return null

          return (
            <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image and Info */}
                <div className="flex-shrink-0">
                  <Link href={`/product/${review.productId}`}>
                    <div className="w-32 h-32 relative overflow-hidden rounded-lg">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                          {product.category}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {product.name}
                      </h4>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {review.rating} out of 5 stars
                        </span>
                      </div>

                      {review.comment && (
                        <div className="mb-4">
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Reviewed on {formatDate(review.createdAt)}
                        </span>
                        
                        <Link
                          href={`/product/${review.productId}`}
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Product
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Product Price */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ₹{product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

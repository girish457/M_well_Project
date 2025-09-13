"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { catalog, searchProducts } from '@/data/products'

type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  description: string
  brand: string
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
}

interface ProductTabsProps {
  products: Product[]
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <div className="flex gap-0.5 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? '★' : '☆'}</span>
      ))}
    </div>
  )
}

function TabProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const { addToCart, removeFromCart, isInCart, updateQuantity, cartItems } = useCart()
  
  // Get current quantity in cart for this product
  const cartItem = cartItems.find(item => item.product.id === product.id)
  const currentQuantity = cartItem ? cartItem.quantity : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInCart(product.id)) {
      removeFromCart(product.id)
    } else {
      addToCart(product)
    }
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const handleQuantityChange = (newQuantity: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (newQuantity <= 0) {
      removeFromCart(product.id)
    } else if (newQuantity > 10) {
      updateQuantity(product.id, 10)
    } else {
      updateQuantity(product.id, newQuantity)
    }
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/product/${product.id}`}
    >
      {/* Product Image */}
      <div className="relative h-64 w-full mb-6 bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-3"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Product Name */}
      <h3 className="font-semibold text-gray-900 text-xl line-clamp-2 mb-3">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="mb-4">
        <StarRow rating={product.rating} />
      </div>

      {/* Pricing */}
      <div className="mb-6">
        {product.originalPrice ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 line-through text-lg">₹{formatPrice(product.originalPrice)}</span>
            <span className="font-bold text-red-600 text-xl">₹{formatPrice(product.price)}</span>
          </div>
        ) : (
          <span className="font-bold text-primary-600 text-xl">₹{formatPrice(product.price)}</span>
        )}
      </div>

      {/* Cart Controls */}
      <div className="flex items-center justify-between">
        {isInCart(product.id) ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => handleQuantityChange(currentQuantity - 1, e)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <span className="w-8 text-center font-medium text-gray-900 text-lg">
              {currentQuantity}
            </span>
            <button
              onClick={(e) => handleQuantityChange(currentQuantity + 1, e)}
              disabled={currentQuantity >= 10}
              className={`p-2 rounded-full transition-colors duration-200 ${
                currentQuantity >= 10
                  ? 'bg-gray-100 cursor-not-allowed opacity-50'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Plus className={`w-5 h-5 ${
                currentQuantity >= 10 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
              }`} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-3 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 text-base font-medium ${
              isHovered ? 'scale-105' : ''
            }`}
          >
            <Image 
              src="/cartlogo.png" 
              alt="Add to Cart" 
              width={20} 
              height={20} 
              className="w-5 h-5 object-contain"
            />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default function ProductTabs({ products }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('featured')

  // Categorize products based on specific requirements
  const featuredProducts = [
    products.find(p => p.name.includes('Multi Vitamin Softgel – Daily Immunity, Energy & Wellness')),
    products.find(p => p.name.includes('Men Care Premium Concentrated Drink – Shakti, Stamina & Vitality Booster for Men')),
    products.find(p => p.name.includes('Super Herbs Veg Capsules – Daily Immunity & Energy Booster')),
    products.find(p => p.name.includes('Multi Vitamin Softgel – Daily Immunity, Energy & Wellness'))
  ].filter(Boolean)

  const topSellingProducts = [
    products.find(p => p.name.includes('Men Care Premium Concentrated Drink – Shakti, Stamina & Vitality Booster for Men')),
    products.find(p => p.name.includes('Multi Vitamin Softgel – Daily Immunity, Energy & Wellness Support')),
    products.find(p => p.name.includes('All Clear Tablets – Ayurvedic Constipation & Digestive Detox Formula')),
    products.find(p => p.name.includes('Anti Anxiety Drops – Natural Stress & Anxiety Relief Formula'))
  ].filter(Boolean)

  const onSaleProducts = [
    products.find(p => p.name.includes('Multi Vitamin Softgel – Daily Immunity, Energy & Wellness')),
    products.find(p => p.name.includes('Men Care Premium Concentrated Drink – Shakti, Stamina & Vitality Booster for Men')),
    products.find(p => p.name.includes('Super Herbs Veg Capsules – Daily Immunity & Energy Booster')),
    products.find(p => p.name.includes('Anti Addiction Drops – Quit Smoking, Alcohol & Gutkha Naturally'))
  ].filter(Boolean)

  const tabs = [
    { id: 'featured', label: 'Featured Products', products: featuredProducts },
    { id: 'top-selling', label: 'Top Selling Products', products: topSellingProducts },
    { id: 'on-sale', label: 'On-sale Products', products: onSaleProducts }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  return (
    <div className="mt-16">
      {/* Full Width Tabs Section */}
      <div className="w-full">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-8 mb-8 border-b border-gray-200 dark:border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-lg font-semibold transition-colors duration-200 relative ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content - List Format */}
        <div className="grid grid-cols-1 gap-4">
          {activeTabData?.products.map((product) => (
            <div 
              key={product.id}
              className="flex gap-4 items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
              onClick={() => window.location.href = `/product/${product.id}`}
            >
              {/* Product Image */}
              <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-600">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </div>
              
              {/* Product Details */}
              <div className="min-w-0 flex-1">
                {/* Product Name */}
                <p className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">{product.name}</p>
                
                {/* Rating */}
                <div className="mb-2">
                  <StarRow rating={product.rating} />
                </div>
                
                {/* Pricing */}
                <div className="flex items-center gap-2">
                  {product.originalPrice ? (
                    <>
                      <span className="font-bold text-red-600 dark:text-red-400 text-lg">₹{formatPrice(product.price)}</span>
                      <span className="text-gray-400 dark:text-gray-500 line-through text-sm">₹{formatPrice(product.originalPrice)}</span>
                    </>
                  ) : (
                    <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">₹{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

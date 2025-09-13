'use client'

import React, { useState, useRef, useEffect } from 'react'

interface PriceFilterProps {
  minPrice: number
  maxPrice: number
  onPriceChange: (min: number, max: number) => void
  onApply: () => void
  onReset: () => void
  minRange?: number
  maxRange?: number
}

export default function PriceFilter({
  minPrice,
  maxPrice,
  onPriceChange,
  onApply,
  onReset,
  minRange = 0,
  maxRange = 2000
}: PriceFilterProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice)
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    setLocalMinPrice(minPrice)
    setLocalMaxPrice(maxPrice)
  }, [minPrice, maxPrice])

  const updateSliderValue = (clientX: number) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const value = minRange + percentage * (maxRange - minRange)

    if (isDragging === 'min') {
      const newMin = Math.min(value, localMaxPrice - 10)
      setLocalMinPrice(Math.round(newMin))
    } else if (isDragging === 'max') {
      const newMax = Math.max(value, localMinPrice + 10)
      setLocalMaxPrice(Math.round(newMax))
    }
  }

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    setIsDragging(type)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      updateSliderValue(e.clientX)
    })
  }

  const handleMouseUp = () => {
    setIsDragging(null)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  const handleTouchStart = (type: 'min' | 'max') => (e: React.TouchEvent) => {
    setIsDragging(type)
    e.preventDefault()
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      updateSliderValue(e.touches[0].clientX)
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(null)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }
  }, [isDragging, localMinPrice, localMaxPrice])

  const minPercentage = ((localMinPrice - minRange) / (maxRange - minRange)) * 100
  const maxPercentage = ((localMaxPrice - minRange) / (maxRange - minRange)) * 100

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price</h3>
      
      <div className="px-1">
        {/* Custom Range Slider */}
        <div 
          ref={sliderRef}
          className="price-slider"
          style={{ touchAction: 'none' }}
        >
          {/* Selected Range Track */}
          <div 
            className={`price-slider-track ${isDragging ? 'dragging' : ''}`}
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`
            }}
          />
          
          {/* Min Handle */}
          <div
            className={`price-slider-handle price-slider-handle-min ${isDragging === 'min' ? 'dragging' : ''}`}
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown('min')}
            onTouchStart={handleTouchStart('min')}
          />
          
          {/* Max Handle */}
          <div
            className={`price-slider-handle price-slider-handle-max ${isDragging === 'max' ? 'dragging' : ''}`}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown('max')}
            onTouchStart={handleTouchStart('max')}
          />
        </div>
        
        {/* Price Display */}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Price: ₹{formatPrice(localMinPrice)} — ₹{formatPrice(localMaxPrice)}
        </p>
        
        {/* Apply and Reset Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              onPriceChange(localMinPrice, localMaxPrice)
              onApply()
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setLocalMinPrice(minRange)
              setLocalMaxPrice(maxRange)
              onPriceChange(minRange, maxRange)
              onReset()
            }}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

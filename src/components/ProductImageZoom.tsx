'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ProductImageZoomProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  zoomScale?: number
}

export default function ProductImageZoom({ 
  src, 
  alt, 
  width = 500, 
  height = 500, 
  className = '',
  zoomScale = 3 
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsZoomed(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsZoomed(false)
    }
  }

  const handleClick = () => {
    if (isMobile) {
      setIsZoomed(!isZoomed)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isZoomed) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate percentage position within the container
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    // Clamp values to prevent zoom from going outside bounds
    const clampedX = Math.max(0, Math.min(100, xPercent))
    const clampedY = Math.max(0, Math.min(100, yPercent))

    setMousePosition({ x: clampedX, y: clampedY })
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Calculate zoom transform - only the image zooms, not the container
  const getZoomTransform = () => {
    if (!isZoomed) return 'scale(1) translate(0, 0)'
    
    // Calculate the offset to center the zoomed area under the cursor
    // This ensures the zoomed image follows the cursor smoothly
    const offsetX = (mousePosition.x - 50) * (zoomScale - 1)
    const offsetY = (mousePosition.y - 50) * (zoomScale - 1)
    
    return `scale(${zoomScale}) translate(${-offsetX}%, ${-offsetY}%)`
  }

  return (
    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-lg">
      <div
        ref={containerRef}
        className={`relative transition-all duration-300 ${isMobile ? 'cursor-pointer' : 'cursor-zoom-in'} ${className}`}
        style={{ width, height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {/* Main Image Container - Only the image zooms, not the frame */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            ref={imageRef}
            src={src}
            alt={alt}
            fill
            className={`object-contain transition-transform duration-200 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: getZoomTransform(),
              transformOrigin: 'center center',
              willChange: 'transform', // Optimize for smooth animations
              imageRendering: 'crisp-edges', // Keep image sharp during zoom
            }}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-500 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Zoom indicator */}
        {isZoomed && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md z-30 backdrop-blur-sm">
            Zoom {zoomScale}x
          </div>
        )}

        {/* Mobile tap indicator */}
        {isMobile && !isZoomed && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            Tap to zoom
          </div>
        )}

        {/* Hover overlay for better UX */}
        {!isZoomed && !isMobile && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                <svg 
                  className="w-6 h-6 text-gray-600 dark:text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Zoom lens effect - Amazon-like subtle indicator */}
        {isZoomed && !isMobile && (
          <div 
            className="absolute pointer-events-none border border-gray-300 bg-white bg-opacity-20 rounded-full shadow-lg"
            style={{
              width: '60px',
              height: '60px',
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              transition: 'all 0.1s ease-out',
              backdropFilter: 'blur(1px)',
            }}
          />
        )}
      </div>
    </div>
  )
}

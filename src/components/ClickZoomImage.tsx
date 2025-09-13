'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ClickZoomImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function ClickZoomImage({ 
  src, 
  alt, 
  width = 500, 
  height = 500, 
  className = ''
}: ClickZoomImageProps) {
  const [zoomLevel, setZoomLevel] = useState(1) // 1x, 2x, 3x
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleClick = () => {
    setZoomLevel(prev => {
      // Cycle through: 1x → 2x → 3x → 1x
      if (prev === 1) return 2
      if (prev === 2) return 3
      return 1
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || zoomLevel === 1) return

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

  // Calculate zoom transform with cursor following
  const getZoomTransform = () => {
    if (zoomLevel === 1) return 'scale(1) translate(0, 0)'
    
    // Calculate the offset to center the zoomed area under the cursor
    const offsetX = (mousePosition.x - 50) * (zoomLevel - 1)
    const offsetY = (mousePosition.y - 50) * (zoomLevel - 1)
    
    return `scale(${zoomLevel}) translate(${-offsetX}%, ${-offsetY}%)`
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`relative cursor-pointer transition-all duration-300 ${className}`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        {/* Product Image - No frame, just the image */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-contain transition-transform duration-300 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: getZoomTransform(),
              transformOrigin: 'center center',
              willChange: 'transform',
              imageRendering: 'crisp-edges',
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
        {zoomLevel > 1 && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md z-30 backdrop-blur-sm">
            Zoom {zoomLevel}x
          </div>
        )}

        {/* Click to zoom indicator */}
        {zoomLevel === 1 && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {isMobile ? 'Tap to zoom' : 'Click to zoom (hover to focus)'}
          </div>
        )}

        {/* Zoom level indicator */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
          {zoomLevel}x
        </div>

        {/* Cursor following indicator when zoomed */}
        {zoomLevel > 1 && (
          <div 
            className="absolute pointer-events-none border border-white bg-white bg-opacity-30 rounded-full shadow-lg"
            style={{
              width: '40px',
              height: '40px',
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
              transition: 'all 0.1s ease-out',
              backdropFilter: 'blur(1px)',
            }}
          />
        )}
      </div>
    </div>
  )
}

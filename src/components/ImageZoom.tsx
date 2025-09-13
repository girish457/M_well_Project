'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ImageZoomProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  zoomScale?: number
}

export default function ImageZoom({ 
  src, 
  alt, 
  width = 400, 
  height = 400, 
  className = '',
  zoomScale = 2.5 
}: ImageZoomProps) {
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
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate percentage position within the container
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    setMousePosition({ x: xPercent, y: yPercent })
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Calculate zoom position based on mouse position
  const getZoomTransform = () => {
    if (!isZoomed) return 'scale(1) translate(0, 0)'
    
    // Calculate the offset to center the zoomed area under the cursor
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
        {/* Main Image */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            ref={imageRef}
            src={src}
            alt={alt}
            fill
            className={`object-cover transition-transform duration-300 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: getZoomTransform(),
              transformOrigin: 'center center',
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
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-30">
            Zoom {zoomScale}x
          </div>
        )}

        {/* Mobile tap indicator */}
        {isMobile && !isZoomed && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            Tap to zoom
          </div>
        )}

        {/* Hover overlay for better UX */}
        {!isZoomed && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
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
      </div>

      {/* Zoom lens effect (optional enhancement) */}
      {isZoomed && (
        <div 
          className="absolute pointer-events-none border-2 border-primary-500 bg-primary-500 bg-opacity-20 rounded-full"
          style={{
            width: '60px',
            height: '60px',
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}

// Enhanced version with thumbnail navigation
interface ImageGalleryProps {
  images: string[]
  alt: string
  width?: number
  height?: number
  className?: string
  zoomScale?: number
}

export function ImageGallery({ 
  images, 
  alt, 
  width = 400, 
  height = 400, 
  className = '',
  zoomScale = 2.5 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image with Zoom */}
      <ImageZoom
        src={images[selectedImage]}
        alt={`${alt} - Image ${selectedImage + 1}`}
        width={width}
        height={height}
        zoomScale={zoomScale}
      />

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === index
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

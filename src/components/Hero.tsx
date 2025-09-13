"use client"
import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { ArrowRight, Play, Star, Users, Award, Shield } from 'lucide-react'

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const carouselImages = [
    '/AntiAddiction.jpg',
    '/Antianxiety.jpg',
    '/Mencare.jpg',
    '/Superherbs.jpg',
    '/mencare2.jpg',
    '/Womencare.jpg',
    '/MultiVitamin.jpg',
    '/AllClear.jpg',
    '/MultiVitamin2.jpg'
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToSlide = React.useCallback((index: number) => {
    setCurrentIndex((index + carouselImages.length) % carouselImages.length)
  }, [carouselImages.length])

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
  }, [carouselImages.length])

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }, [carouselImages.length])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [currentIndex, carouselImages.length])
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-all duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-primary-100 dark:bg-primary-900 rounded-full -translate-y-48 translate-x-40 opacity-40 blur-sm float-element"></div>
        <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-accent-100 dark:bg-accent-900 rounded-full translate-y-36 -translate-x-32 opacity-40 blur-sm float-element-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary-200 dark:bg-primary-800 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-25 animate-pulse-slow"></div>

        {/* Corner floaters: 2 images on left, 2 on right */}
        <HeroCornerFloaters />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <div className="space-y-8 animate-fade-in mt-1">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight animate-slide-up">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400">
                  Start & End Your Day,
                </span>
                <span className="block text-gray-900 dark:text-white">
                  The <span className="text-primary-600 dark:text-primary-400 text-glow animate-pulse">M-Well</span> Way
                </span>
              </h1>
              <p className="whitespace-nowrap text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-normal animate-slide-up">
                100% ORGANIC | HERBAL | HOLISTIC WELLNESS
              </p>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up">
                Discover our full range of ayurvedic wellness products - designed for balance, vitality, and peace of mind
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center card-3d hover-lift">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-2 glow-primary animate-bounce-slow">
                  <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Products Served</div>
              </div>
              <div className="text-center card-3d hover-lift">
                <div className="flex items-center justify-center w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-lg mx-auto mb-2 glow-accent animate-bounce-slow">
                  <Award className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="text-center card-3d hover-lift">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mx-auto mb-2 glow-primary animate-bounce-slow">
                  <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">99%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-scale-in">
              <Link href="/appointments" className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center glow-primary hover-scale">
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
              </Link>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center hover-scale"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Video
              </button>
            </div>

            {isVideoOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="relative w-full max-w-3xl">
                  <button
                    aria-label="Close video"
                    onClick={() => setIsVideoOpen(false)}
                    className="absolute -top-10 right-0 text-white/90 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                  <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
                    <video
                      src="/mwellvideo.mp4"
                      className="w-full h-[50vh] md:h-[60vh] object-contain bg-black"
                      controls
                      autoPlay
                      playsInline
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-4 animate-fade-in">
              <div className="flex items-center space-x-1 hover-scale">
                <div className="flex">
                  {(() => {
                    const rating = 4.1
                    return [0,1,2,3,4].map((i) => {
                      const percent = Math.max(0, Math.min(100, (rating - i) * 100))
                      return (
                        <span key={i} className="relative inline-block h-5 w-5 mr-0.5">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          </span>
                        </span>
                      )
                    })
                  })()}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">4.1/5 Rating</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 hover-scale">
                Trusted by 10,000+ Customers
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="relative z-0 card-3d">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-3xl p-6 md:p-6 lg:p-7 glow-primary max-w-lg mx-auto">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-2 animate-spin-slow shadow-md">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center glow-primary animate-pulse bg-white">
                        <Image src="/smallwell.png" alt="M-Well Logo" width={64} height={64} className="object-contain" />
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-0 tracking-tight">Welcome to M-Well</h3>
                    <p className="text-gray-600 dark:text-gray-400">Your health journey starts here</p>
                  </div>
                  
                  {/* Sliding image carousel */}
                  <div className="relative w-full overflow-hidden rounded-xl shadow-md h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 -mt-1">
                    <div
                      className="flex h-full w-full transition-transform duration-700 ease-out pointer-events-none"
                      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                      {carouselImages.map((src, i) => (
                        <div key={i} className="relative min-w-full h-full">
                          <Image src={src} alt={`Slide ${i + 1}`} fill className="object-cover" priority={i === 0} />
                        </div>
                      ))}
                    </div>

                    {/* Controls overlay to ensure click capture with wide zones */}
                    <div className="absolute inset-0 z-50 pointer-events-none">
                      <div
                        className="absolute inset-y-0 left-0 w-1/3 pointer-events-auto"
                        aria-label="Previous image area"
                        onClick={prevSlide}
                      />
                      <div
                        className="absolute inset-y-0 right-0 w-1/3 pointer-events-auto"
                        aria-label="Next image area"
                        onClick={nextSlide}
                      />
                      <div className="absolute inset-0 flex items-center justify-between">
                        <button
                          aria-label="Previous image"
                          onClick={prevSlide}
                          type="button"
                          className="pointer-events-auto ml-2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm"
                        >
                          ‹
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={nextSlide}
                          type="button"
                          className="pointer-events-auto mr-2 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dots */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    {carouselImages.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to image ${i + 1}`}
                        onClick={() => goToSlide(i)}
                        className={`${i === currentIndex ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'} rounded-full transition-colors duration-300`}
                        style={{ width: 8, height: 8 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-200 dark:bg-accent-800 rounded-full opacity-60 float-element"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-60 float-element-delayed"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroCornerFloaters() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {/* Static, subtle decorative images for a professional look */}
      <div className="hidden md:block absolute top-8 left-8 w-24 h-24 lg:w-28 lg:h-28 opacity-45 drop-shadow-lg -rotate-2 animate-float" style={{ animationDelay: '0.5s' }}>
        <Image src="/bottle1.png" alt="Product" fill className="object-contain" />
      </div>
      <div className="hidden md:block absolute bottom-10 right-10 w-24 h-24 lg:w-28 lg:h-28 opacity-45 drop-shadow-lg rotate-2 animate-float" style={{ animationDelay: '1.3s' }}>
        <Image src="/bottle4.png" alt="Product" fill className="object-contain" />
      </div>
    </div>
  )
}

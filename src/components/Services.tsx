"use client"
import Image from 'next/image'
import { Star } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

export default function Services() {
  const [showViewAll1, setShowViewAll1] = React.useState(false)
  const [showViewAll2, setShowViewAll2] = React.useState(false)
  const scrollRef1 = React.createRef<HTMLDivElement>()
  const scrollRef2 = React.createRef<HTMLDivElement>()

  const categories = [
    { title: 'Daily Essentials', image: '/AllClear.jpg' },
    { title: 'Personal Care', image: '/Mencare.jpg' },
    { title: 'Anti Anxiety & Addiction', image: '/Antianxiety.jpg' }
  ]

  const products = [
    { id: 'mv-001', title: 'M-Well Multi Vitamin Softgel – Daily Immunity, Energy & Wellness', image: '/MultiVitamin.jpg', price: 959, originalPrice: 1599, discount: 40 },
    { id: 'mc-002', title: 'M-Well Men Care Premium Concentrated Drink – Shakti, Stamina & Vitality Booster for Men', image: '/Mencare.jpg', price: 1199, originalPrice: 1999, discount: 40 },
    { id: 'aa-005', title: 'M-Well Anti Anxiety Drops – Natural Stress & Anxiety Relief Formula', image: '/Antianxiety.jpg', price: 1019, originalPrice: 1699, discount: 40 },
    { id: 'sh-003', title: 'M-Well Super Herbs Veg Capsules – Daily Immunity & Energy Booster', image: '/Superherbs.jpg', price: 1199, originalPrice: 1999, discount: 40 },
    { id: 'wc-006', title: 'M-Well Women Care Syrup– Hormonal Balance & PCOD/PCOS Relief', image: '/Womencare.jpg', price: 359, originalPrice: 599, discount: 40 },
    { id: 'ac-004', title: 'M-Well All Clear Tablets – Ayurvedic Constipation & Digestive Detox Formula', image: '/AllClear.jpg', price: 1079, originalPrice: 1799, discount: 40 },
    { id: 'ad-007', title: 'M-Well Anti Addiction Drops – Quit Smoking, Alcohol & Gutkha Naturally', image: '/AntiAddiction.jpg', price: 1139, originalPrice: 1899, discount: 40 },
  ]

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)

  const onScroll1 = () => {
    const el = scrollRef1.current
    if (!el) return
    setShowViewAll1(el.scrollLeft > 0)
  }

  const onScroll2 = () => {
    const el = scrollRef2.current
    if (!el) return
    setShowViewAll2(el.scrollLeft > 0)
  }

  const scrollByAmount1 = (dir: 'left' | 'right') => () => {
    const el = scrollRef1.current
    if (!el) return
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.9))
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
    if (dir === 'right') setShowViewAll1(true)
    if (dir === 'left' && el.scrollLeft - amount <= 0) setShowViewAll1(false)
  }

  const scrollByAmount2 = (dir: 'left' | 'right') => () => {
    const el = scrollRef2.current
    if (!el) return
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.9))
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
    if (dir === 'right') setShowViewAll2(true)
    if (dir === 'left' && el.scrollLeft - amount <= 0) setShowViewAll2(false)
  }

  return (
    <section className="bg-primary-50/40 dark:bg-gray-900 section-padding transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Top Categories
          </h2>
          <Link href="/shop" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">View all</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Link key={index} href={{ pathname: '/shop', query: { category: cat.title } }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
              <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {cat.title}
              </h3>
              <div className="relative mx-auto rounded-xl overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700" style={{ width: '100%', height: 320 }}>
                <Image src={cat.image} alt={cat.title} fill className="object-contain bg-white" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Recommended M-Well Products</h3>
            <div className="hidden sm:flex items-center gap-3">
              <button aria-label="Scroll left" onClick={scrollByAmount1('left')} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 shadow hover:shadow-md hover:-translate-y-0.5 transition">←</button>
              <button aria-label="Scroll right" onClick={scrollByAmount1('right')} className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow hover:shadow-md hover:-translate-y-0.5 transition">→</button>
            </div>
          </div>
          <div className="relative">
            <div ref={scrollRef1} onScroll={onScroll1} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]" style={{scrollBehavior:'smooth'}}>
              {/* hide scrollbar */}
              <style jsx>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>
              {products.slice(0, 4).map((p, i) => (
                <Link key={p.id} href={`/product/${p.id}`} className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] snap-start rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md overflow-hidden">
                  <div className="relative mx-6 my-4 rounded-xl bg-primary-50/60 dark:bg-gray-700/50" style={{ height: 320 }}>
                    <Image src={p.image} alt={p.title} fill className="object-contain" />
                    {p.discount ? (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">-{p.discount}%</div>
                    ) : null}
                  </div>
                  <div className="px-4 pb-4">
                    <h4 className="text-gray-800 dark:text-gray-100 font-semibold line-clamp-2 min-h-[3rem]">{p.title}</h4>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex items-baseline gap-2">
                        {p.originalPrice ? (
                          <>
                            <span className="text-lg font-semibold text-red-600 dark:text-red-400">₹{formatPrice(p.price)}</span>
                            <span className="text-gray-400 line-through">₹{formatPrice(p.originalPrice)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-primary-700 dark:text-primary-300">₹{formatPrice(p.price)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">4.5 Star</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {showViewAll1 && (
              <Link href="/shop" className="hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-0 mr-1 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-primary-700 dark:text-primary-300 font-semibold shadow hover:shadow-md transition">
                View all
              </Link>
            )}
          </div>
        </div>

        {/* Popular Products carousel */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Popular Healthcare Products</h3>
            <div className="hidden sm:flex items-center gap-3">
              <button aria-label="Scroll left" onClick={scrollByAmount2('left')} className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 shadow hover:shadow-md hover:-translate-y-0.5 transition">←</button>
              <button aria-label="Scroll right" onClick={scrollByAmount2('right')} className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shadow hover:shadow-md hover:-translate-y-0.5 transition">→</button>
            </div>
          </div>
          <div className="relative">
            <div ref={scrollRef2} onScroll={onScroll2} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]" style={{scrollBehavior:'smooth'}}>
              <style jsx>{`
                div::-webkit-scrollbar { display: none; }
              `}</style>
              {products.slice(0, 4).map((p, i) => (
                <Link key={p.id} href={`/product/${p.id}`} className="min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] snap-start rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md overflow-hidden">
                  <div className="flex items-center justify-between px-4 pt-4 text-xs">
                    {p.discount ? (
                      <span className="px-2 py-1 rounded-md bg-green-50 text-green-600 font-semibold">{p.discount}% OFF</span>
                    ) : <span />}
                    <span className="text-amber-500">1500 pts</span>
                  </div>
                  <div className="relative mx-6 my-4 rounded-xl bg-primary-50/60 dark:bg-gray-700/50" style={{ height: 320 }}>
                    <Image src={p.image} alt={p.title} fill className="object-contain" />
                  </div>
                  <div className="px-4 pb-4">
                    <h4 className="text-gray-800 dark:text-gray-100 font-semibold line-clamp-2 min-h-[3rem]">{p.title}</h4>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="flex items-baseline gap-2">
                        {p.originalPrice ? (
                          <>
                            <span className="text-lg font-semibold text-red-600 dark:text-red-400">₹{formatPrice(p.price)}</span>
                            <span className="text-gray-400 line-through">₹{formatPrice(p.originalPrice)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-primary-700 dark:text-primary-300">₹{formatPrice(p.price)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">4.5 Star</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {showViewAll2 && (
              <Link href="/shop" className="hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-0 mr-1 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-primary-700 dark:text-primary-300 font-semibold shadow hover:shadow-md transition">
                View all
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
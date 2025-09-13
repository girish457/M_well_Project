'use client'

import { useCompare } from '@/contexts/CompareContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

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

// Basic catalog (same as shop page). In a real app, centralize this in a shared module or fetch from API.
const catalog: Product[] = [
  { id: 'mv-001', name: 'M-Well Multi Vitamin Softgel – Daily Immunity, Energy & Wellness', price: 959, originalPrice: 1599, discount: 40, image: '/MultiVitamin.jpg', description: 'Daily nutrition formula boosting immunity, energy, and overall health.', brand: 'M-Well', category: 'Daily Essentials', rating: 4.6, reviewCount: 128, inStock: true, isNew: true },
  { id: 'mc-002', name: 'M-Well Men Care Premium Concentrated Drink – Shakti, Stamina & Vitality Booster for Men', price: 1199, originalPrice: 1999, discount: 40, image: '/Mencare.jpg', description: 'Ayurvedic superblend for stamina, strength, and vitality.', brand: 'M-Well', category: 'Personal Care', rating: 4.4, reviewCount: 86, inStock: true, isSale: true },
  { id: 'sh-003', name: 'M-Well Super Herbs Veg Capsules – Daily Immunity & Energy Booster', price: 1199, originalPrice: 1999, discount: 40, image: '/Superherbs.jpg', description: 'Boosts daily health, immunity, stamina, and energy levels.', brand: 'M-Well', category: 'Daily Essentials', rating: 4.7, reviewCount: 203, inStock: true },
  { id: 'ac-004', name: 'M-Well All Clear Tablets – Ayurvedic Constipation & Digestive Detox Formula', price: 1079, originalPrice: 1799, image: '/AllClear.jpg', description: 'Cleanses digestive system and relieves constipation, bloating, and acidity.', brand: 'M-Well', category: 'Daily Essentials', rating: 4.2, reviewCount: 57, inStock: true },
  { id: 'aa-005', name: 'M-Well Anti Anxiety Drops – Natural Stress & Anxiety Relief Formula', price: 1019, originalPrice: 1699, discount: 40, image: '/Antianxiety.jpg', description: 'Provides relief from anxiety, stress, and sleep problems.', brand: 'M-Well', category: 'Personal Care', rating: 4.1, reviewCount: 41, inStock: true },
  { id: 'wc-006', name: 'M-Well Women Care Syrup– Hormonal Balance & PCOD/PCOS Relief', price: 359, originalPrice: 599, discount: 40, image: '/Womencare.jpg', description: 'Supports hormonal health and manages PCOD/PCOS.', brand: 'M-Well', category: 'Personal Care', rating: 4.5, reviewCount: 112, inStock: true },
  { id: 'ad-007', name: 'M-Well Anti Addiction Drops – Quit Smoking, Alcohol & Gutkha Naturally', price: 1139, originalPrice: 1899, discount: 40, image: '/AntiAddiction.jpg', description: 'Helps break free from addictions naturally.', brand: 'M-Well', category: 'Anti Anxiety & Addiction', rating: 4.0, reviewCount: 33, inStock: true },
]

export default function CompareSelectPage() {
  const router = useRouter()
  const { compared, addToCompare, removeFromCompare, isInCompare } = useCompare()

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  React.useEffect(() => {
    setSelectedIds(compared.map(p => p.id))
  }, [compared])

  const toggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN',{minimumFractionDigits:2, maximumFractionDigits:2}).format(price)

  const applyAndCompare = () => {
    // Sync context with selected
    const setIds = new Set(selectedIds)
    // Remove those not selected
    compared.forEach(p => { if (!setIds.has(p.id)) removeFromCompare(p.id) })
    // Add newly selected
    catalog.forEach(p => { if (setIds.has(p.id) && !isInCompare(p.id)) addToCompare(p as any) })
    router.push('/compare')
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Select Products to Compare</h1>
          <Link href="/compare" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">View current comparison</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.map(p => (
            <label key={p.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex gap-4 cursor-pointer">
              <input
                type="checkbox"
                className="mt-2"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggle(p.id)}
              />
              <div className="flex-1">
                <div className="relative w-full h-32 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden mb-3">
                  <Image src={p.image} alt={p.name} fill className="object-contain p-2" />
                </div>
                <div className="font-medium text-gray-900 dark:text-white line-clamp-2">{p.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{p.description}</div>
                <div className="mt-2 font-semibold text-primary-600 dark:text-primary-400">₹{formatPrice(p.price)}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/shop" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Back to shop</Link>
          <button onClick={applyAndCompare} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition">Compare selected ({selectedIds.length})</button>
        </div>
      </div>
    </main>
  )
}



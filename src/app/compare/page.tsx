'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCompare } from '@/contexts/CompareContext'

export default function ComparePage() {
  const { compared, removeFromCompare, clearCompare } = useCompare()

  if (compared.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Compare Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You haven&apos;t added any products to compare yet.</p>
          <Link href="/shop" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition">Go to Shop</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Products</h1>
          <button onClick={clearCompare} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">Clear list</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                {compared.map(p => (
                  <th key={p.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      <span>{p.name.slice(0, 40)}{p.name.length>40?'…':''}</span>
                      <button onClick={() => removeFromCompare(p.id)} className="text-red-500 hover:text-red-600 text-xs">Remove</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {/* Image */}
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Image</td>
                {compared.map(p => (
                  <td key={p.id} className="px-4 py-4">
                    <div className="relative w-28 h-28 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-2" />
                    </div>
                  </td>
                ))}
              </tr>
              {/* Name */}
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Name</td>
                {compared.map(p => (
                  <td key={p.id} className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{p.name}</td>
                ))}
              </tr>
              {/* Price */}
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Price</td>
                {compared.map(p => (
                  <td key={p.id} className="px-4 py-4 text-sm font-semibold text-primary-600 dark:text-primary-400">₹{new Intl.NumberFormat('en-IN',{minimumFractionDigits:2, maximumFractionDigits:2}).format(p.price)}</td>
                ))}
              </tr>
              {/* Rating */}
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Rating</td>
                {compared.map(p => (
                  <td key={p.id} className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{p.rating} ★</td>
                ))}
              </tr>
              {/* Key Details */}
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Category</td>
                {compared.map(p => (
                  <td key={p.id} className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{p.category}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Brand</td>
                {compared.map(p => (
                  <td key={p.id} className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">{p.brand}</td>
                ))}
              </tr>
              {compared.some(p => p.originalPrice) && (
                <tr>
                  <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">Original Price</td>
                  {compared.map(p => (
                    <td key={p.id} className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{p.originalPrice ? `₹${new Intl.NumberFormat('en-IN',{minimumFractionDigits:2, maximumFractionDigits:2}).format(p.originalPrice)}` : '-'}</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-right">
          <Link href="/shop" className="inline-flex items-center px-5 py-2.5 rounded-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 transition">Add more products</Link>
        </div>
      </div>
    </main>
  )
}



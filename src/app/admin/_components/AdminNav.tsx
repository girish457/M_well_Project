'use client'

import Link from 'next/link'
import React from 'react'

export default function AdminNav({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-900 dark:text-white">M-Well Admin</span>
          <Link href="/admin" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">Dashboard</Link>
          <Link href="/admin/products" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">Products</Link>
          <Link href="/admin/orders" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">Orders</Link>
          <Link href="/admin/users" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">Users</Link>
        </div>
        <button onClick={onLogout} className="text-sm text-red-600 hover:text-red-700">Logout</button>
      </div>
    </nav>
  )
}



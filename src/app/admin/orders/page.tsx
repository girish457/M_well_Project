'use client'

import React from 'react'
import AdminNav from '../_components/AdminNav'

export default function OrdersPage() {
  const [token, setToken] = React.useState<string | null>(null)
  const [orders, setOrders] = React.useState<any[]>([])

  React.useEffect(() => { const t = sessionStorage.getItem('admin_token'); if (t) setToken(t) }, [])
  React.useEffect(() => {
    if (!token) return
    fetch('/api/v2/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setOrders(d.orders || []))
  }, [token])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav onLogout={()=>{ sessionStorage.removeItem('admin_token'); location.href='/admin' }} />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Orders</h1>
        <div className="grid gap-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{new Date(o.createdAt).toLocaleString()}</span>
                <span className="font-semibold">₹{o.totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">Status: {o.status}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}



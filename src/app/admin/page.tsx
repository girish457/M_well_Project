'use client'

import React from 'react'
import AdminNav from './_components/AdminNav'

export default function AdminPage() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [token, setToken] = React.useState<string | null>(null)
  const [error, setError] = React.useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/v2/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    if (res.ok) {
      const data = await res.json()
      setToken(data.accessToken)
      try { sessionStorage.setItem('admin_token', data.accessToken) } catch {}
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Unauthorized')
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2">Login</button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav onLogout={()=>setToken(null)} />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Users" subtitle="View and manage users" href="/admin/users" />
          <Card title="Orders" subtitle="Track order statuses" href="/admin/orders" />
          <Card title="Products" subtitle="Add/Edit products" href="/admin/products" />
        </div>
      </div>
    </main>
  )
}

function Card({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <a href={href} className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
    </a>
  )
}

// Removed duplicate dashboard implementation that was causing server errors
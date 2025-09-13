'use client'

import React from 'react'
import AdminNav from '../_components/AdminNav'

type Product = { id: string; name: string; price: number; stock: number; category: string; image: string }

export default function ProductsPage() {
  const [token, setToken] = React.useState<string | null>(null)
  const [products, setProducts] = React.useState<Product[]>([])
  const [form, setForm] = React.useState<Omit<Product, 'id'>>({ name: '', price: 0, stock: 0, category: '', image: '' })
  const [error, setError] = React.useState('')

  React.useEffect(() => { const t = sessionStorage.getItem('admin_token'); if (t) setToken(t) }, [])

  const load = React.useCallback(() => {
    fetch('/api/v2/products')
      .then(r => r.json()).then(d => setProducts(d.products || []))
  }, [])

  React.useEffect(() => { load() }, [load])

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!token) return setError('Unauthorized')
    const res = await fetch('/api/v2/products', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (res.ok) { setForm({ name: '', price: 0, stock: 0, category: '', image: '' }); load() } else { const d = await res.json(); setError(d.error || 'Failed') }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav onLogout={()=>{ sessionStorage.removeItem('admin_token'); location.href='/admin' }} />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Products</h1>
        <form onSubmit={create} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow grid md:grid-cols-5 gap-3 items-end mb-6">
          {error && <div className="md:col-span-5 text-sm text-red-600">{error}</div>}
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input type="number" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} placeholder="Price" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input type="number" value={form.stock} onChange={e=>setForm({...form,stock:parseInt(e.target.value||'0')})} placeholder="Stock" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Image URL" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          <button type="submit" className="md:col-span-5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2">Add Product</button>
        </form>

        <div className="grid md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">₹{p.price.toFixed(2)} • Stock: {p.stock}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{p.category}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}



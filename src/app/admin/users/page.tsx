'use client'

import React from 'react'
import AdminNav from '../_components/AdminNav'

export default function UsersPage() {
  const [token, setToken] = React.useState<string | null>(null)
  const [users, setUsers] = React.useState<any[]>([])

  React.useEffect(() => {
    const t = sessionStorage.getItem('admin_token')
    if (t) setToken(t)
  }, [])

  React.useEffect(() => {
    if (!token) return
    fetch('/api/v2/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setUsers(d.users || []))
  }, [token])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav onLogout={()=>{ sessionStorage.removeItem('admin_token'); location.href='/admin' }} />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Users</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 text-gray-900 dark:text-gray-100">{u.name || '-'}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{u.email}</td>
                  <td className="p-3"><span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{u.role}</span></td>
                  <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}



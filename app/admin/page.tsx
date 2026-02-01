'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MemeUploadForm from '../components/MemeUploadForm'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({ total: 0, trending: 0, indian: 0, international: 0 })
  const router = useRouter()

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
      fetchStats()
    }
  }, [router])

  const fetchStats = async () => {
    const { data } = await supabase.from('memes').select('category')
    
    if (data) {
      setStats({
        total: data.length,
        trending: data.filter(m => m.category === 'trending').length,
        indian: data.filter(m => m.category === 'indian').length,
        international: data.filter(m => m.category === 'international').length,
      })
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    router.push('/admin/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50" suppressHydrationWarning> 
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              🎭 Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button> 
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600" suppressHydrationWarning>{stats.total}</div>
            <div className="text-gray-600 mt-1">Total Memes</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600" suppressHydrationWarning>{stats.total}</div> 
            <div className="text-gray-600 mt-1">🔥 Trending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600" suppressHydrationWarning>{stats.total}</div>
            <div className="text-gray-600 mt-1">🇮🇳 Indian</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600" suppressHydrationWarning>{stats.total}</div>
            <div className="text-gray-600 mt-1">🌍 International</div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upload New Meme
          </h2>
          <MemeUploadForm />
        </div>
      </main>
    </div>
  )
}
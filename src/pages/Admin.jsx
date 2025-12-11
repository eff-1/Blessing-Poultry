import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroManager } from '../components/Admin/HeroManager'
import { AdminNavbar } from '../components/Admin/AdminNavbar'
import { AdminSidebar } from '../components/Admin/AdminSidebar'
import { supabase } from '../lib/supabaseClient'

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('heroes')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login Required</h2>
          <p className="text-gray-600 text-center">Please log in to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar user={user} />
      
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'heroes' && <HeroManager />}
            {activeTab === 'products' && <div>Products Management (Coming Soon)</div>}
            {activeTab === 'orders' && <div>Orders Management (Coming Soon)</div>}
            {activeTab === 'settings' && <div>Settings (Coming Soon)</div>}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
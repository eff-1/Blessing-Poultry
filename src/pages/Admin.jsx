import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroManager } from '../components/Admin/HeroManager'
import { AdminNavbar } from '../components/Admin/AdminNavbar'
import { AdminSidebar } from '../components/Admin/AdminSidebar'
import { DashboardHome } from '../components/Admin/DashboardHome'
import { ManageProducts } from '../components/Admin/ManageProducts'
import { ManageGallery } from '../components/Admin/ManageGallery'
import { ManageTestimonials } from '../components/Admin/ManageTestimonials'
import { ManageContact } from '../components/Admin/ManageContact'
import { ManageAbout } from '../components/Admin/ManageAbout'
import { SiteAnalytics } from '../components/Admin/SiteAnalytics'
import { AdminSettings } from '../components/Admin/AdminSettings'
import { supabase } from '../lib/supabaseClient'

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content area - offset by sidebar width on desktop */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top navbar */}
        <AdminNavbar user={user} />
        
        {/* Main content - scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Spacer for fixed navbar */}
          <div className="h-16"></div>
          
          {/* Content with padding */}
          <div className="p-4 md:p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <DashboardHome setActiveTab={setActiveTab} />
                </div>
              )}
              {activeTab === 'heroes' && <HeroManager />}
              {activeTab === 'products' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <ManageProducts />
                </div>
              )}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">Orders Management</h2>
                  <p className="text-gray-600">Coming Soon - Order tracking and management features</p>
                </div>
              )}
              {activeTab === 'gallery' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <ManageGallery />
                </div>
              )}
              {activeTab === 'customers' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <ManageTestimonials />
                </div>
              )}
              {activeTab === 'analytics' && (
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <SiteAnalytics />
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                    <AdminSettings />
                  </div>
                  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                    <ManageContact />
                  </div>
                  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                    <ManageAbout />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
        </div>
    </div>
  )
}
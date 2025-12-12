import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { FiPackage, FiCamera, FiStar, FiImage } from 'react-icons/fi'

export const DashboardHome = ({ setActiveTab }) => {
  const [stats, setStats] = useState({ products: 0, gallery: 0, testimonials: 0, heroes: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [products, gallery, testimonials, heroes] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase.from('heroes').select('*', { count: 'exact', head: true }),
    ])

    setStats({
      products: products.count || 0,
      gallery: gallery.count || 0,
      testimonials: testimonials.count || 0,
      heroes: heroes.count || 0,
    })
  }

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: FiPackage, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Gallery Images', value: stats.gallery, icon: FiCamera, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Testimonials', value: stats.testimonials, icon: FiStar, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Hero Banners', value: stats.heroes, icon: FiImage, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              className={`${stat.bg} rounded-xl p-4 md:p-6 border border-gray-100`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div 
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('products')}
          >
            <FiPackage className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Add Product</h4>
            <p className="text-sm text-gray-600">Add new poultry products to your catalog</p>
          </motion.div>
          
          <motion.div 
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('gallery')}
          >
            <FiCamera className="w-8 h-8 text-purple-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Upload Images</h4>
            <p className="text-sm text-gray-600">Add photos to your gallery</p>
          </motion.div>
          
          <motion.div 
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('heroes')}
          >
            <FiImage className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Manage Heroes</h4>
            <p className="text-sm text-gray-600">Update seasonal hero banners</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

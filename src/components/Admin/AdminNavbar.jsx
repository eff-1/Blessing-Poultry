import { motion } from 'framer-motion'
import { GiChicken } from 'react-icons/gi'
import { FiUser, FiLogOut } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'

export const AdminNavbar = ({ user }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <motion.nav 
      className="bg-white shadow-lg border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
              <GiChicken className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Blessing Poultries</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FiUser className="text-lg" />
              <span className="font-medium">{user?.email}</span>
            </div>
            
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
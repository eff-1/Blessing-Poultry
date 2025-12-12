import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiChicken } from 'react-icons/gi'
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { AdminNotifications } from './AdminNotifications'

export const AdminNavbar = ({ user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <motion.nav 
      className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 fixed top-0 left-0 right-0 z-30"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Title (hidden on mobile when sidebar button is visible) */}
          <div className="flex items-center gap-3">
            {/* Spacer for mobile menu button */}
            <div className="w-12 lg:w-0"></div>
            <div className="hidden md:block">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
          </div>

          {/* Right side - User Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <AdminNotifications />
            
            {/* Desktop User Info */}
            <div className="hidden md:flex items-center gap-2 text-gray-700">
              <FiUser className="text-lg" />
              <span className="font-medium text-sm lg:text-base truncate max-w-32 lg:max-w-none">
                {user?.email}
              </span>
            </div>
            
            {/* Mobile User Dropdown */}
            <div className="md:hidden relative" ref={menuRef}>
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser className="w-4 h-4" />
                <FiChevronDown className="w-3 h-3" />
              </motion.button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Desktop Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm lg:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
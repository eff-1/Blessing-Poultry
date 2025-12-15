import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiImage, 
  FiPackage, 
  FiShoppingCart, 
  FiSettings, 
  FiMenu, 
  FiX,
  FiHome,
  FiBarChart,
  FiUsers,
  FiCamera,
  FiDollarSign,
  FiBell
} from 'react-icons/fi'
import { GiChicken } from 'react-icons/gi'

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'heroes', label: 'Hero Management', icon: FiImage },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'orders', label: 'Orders', icon: FiShoppingCart },
    { id: 'gallery', label: 'Gallery', icon: FiCamera },
    { id: 'customers', label: 'Testimonials', icon: FiUsers },
    { id: 'financial', label: 'Financial Manager', icon: FiDollarSign },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ]

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`${isMobile ? 'p-4' : 'p-4 lg:p-6'} border-b border-gray-200`}>
        <div className="flex items-center gap-3">
          <div className={`${isMobile ? 'w-10 h-10' : 'w-10 h-10'} bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center`}>
            <GiChicken className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
          </div>
          <div className={isMobile ? 'block' : 'hidden lg:block'}>
            <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>
              {isMobile ? 'Blessing Poultries' : 'Blessing Poultries'}
            </h2>
            <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-500`}>
              Admin Panel
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className={`flex-1 ${isMobile ? 'p-4 space-y-2' : 'p-4 lg:p-6 space-y-1'} overflow-y-auto`}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setIsMobileMenuOpen(false)
              }}
              className={`w-full flex items-center ${isMobile ? 'gap-3 px-3 py-3' : 'gap-3 px-3 py-2.5'} rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${isMobile ? 'max-w-full overflow-hidden' : ''}`}
              whileHover={{ scale: isMobile ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative flex-shrink-0">
                <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-green-600' : 'text-gray-400'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`font-medium text-sm truncate ${isMobile ? 'flex-1 min-w-0' : ''}`}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </nav>

      {/* Footer - Only show version on desktop sidebar */}
      {!isMobile && (
        <div className="p-4 lg:p-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Admin Panel v1.0
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button - Only show on mobile/tablet */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? (
            <FiX className="w-5 h-5 text-gray-700" />
          ) : (
            <FiMenu className="w-5 h-5 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* Desktop Sidebar - Always visible on large screens (1024px+) */}
      <motion.aside 
        className="hidden lg:flex w-64 bg-white shadow-sm border-r border-gray-200 h-screen flex-col flex-shrink-0 fixed left-0 top-0 z-40"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 flex flex-col overflow-hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="w-full h-full overflow-y-auto">
                <SidebarContent isMobile={true} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
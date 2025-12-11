import { motion } from 'framer-motion'
import { FiImage, FiPackage, FiShoppingCart, FiSettings } from 'react-icons/fi'

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'heroes', label: 'Hero Management', icon: FiImage },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'orders', label: 'Orders', icon: FiShoppingCart },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ]

  return (
    <motion.aside 
      className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>
      </div>
    </motion.aside>
  )
}
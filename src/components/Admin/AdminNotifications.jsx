import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { useNotification } from '../Shared/NotificationSystem'
import { 
  FiBell, 
  FiX, 
  FiUsers, 
  FiShoppingCart, 
  FiMessageCircle,
  FiEye,
  FiUserPlus,
  FiTrendingUp,
  FiCheck
} from 'react-icons/fi'

export const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { showSuccess } = useNotification()

  useEffect(() => {
    fetchNotifications()
    
    // Set up real-time updates
    const interval = setInterval(fetchNotifications, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      // In a real app, this would come from your analytics/notification service
      // For now, we'll simulate real-time notifications based on actual data
      
      const { data: products } = await supabase.from('products').select('name, stock_quantity, stock_status')
      const { data: testimonials } = await supabase.from('testimonials').select('name').order('created_at', { ascending: false }).limit(1)
      
      const lowStockCount = products?.filter(p => p.stock_quantity < 10).length || 0
      const outOfStockCount = products?.filter(p => p.stock_status === 'out_of_stock').length || 0
      const totalProducts = products?.length || 0
      const recentTestimonial = testimonials?.[0]
      
      const realNotifications = []
      
      // Only add notifications if there's actual data
      if (lowStockCount > 0) {
        realNotifications.push({
          id: 1,
          type: 'low_stock',
          title: 'Low Stock Alert',
          message: `${lowStockCount} product${lowStockCount > 1 ? 's are' : ' is'} running low on stock`,
          time: '5 minutes ago',
          icon: FiShoppingCart,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          unread: true
        })
      }
      
      if (outOfStockCount > 0) {
        realNotifications.push({
          id: 2,
          type: 'out_of_stock',
          title: 'Out of Stock',
          message: `${outOfStockCount} product${outOfStockCount > 1 ? 's are' : ' is'} out of stock`,
          time: '10 minutes ago',
          icon: FiShoppingCart,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          unread: true
        })
      }
      
      if (recentTestimonial) {
        realNotifications.push({
          id: 3,
          type: 'new_testimonial',
          title: 'Customer Review',
          message: `${recentTestimonial.name} left a ${recentTestimonial.rating}-star review`,
          time: '1 hour ago',
          icon: FiMessageCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          unread: false
        })
      }
      
      if (totalProducts > 0) {
        realNotifications.push({
          id: 4,
          type: 'product_count',
          title: 'Product Catalog',
          message: `You have ${totalProducts} product${totalProducts > 1 ? 's' : ''} in your catalog`,
          time: '2 hours ago',
          icon: FiTrendingUp,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          unread: false
        })
      }
      
      setNotifications(realNotifications)
      setUnreadCount(realNotifications.filter(n => n.unread).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, unread: false } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    setUnreadCount(0)
    showSuccess('All notifications marked as read', { title: 'Notifications' })
  }

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    const notification = notifications.find(n => n.id === notificationId)
    if (notification?.unread) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <notification.icon className={`w-4 h-4 ${notification.color}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-medium ${
                                notification.unread ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      // Navigate to analytics or notifications page
                    }}
                    className="w-full text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View All Activity
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { 
  FiUsers, 
  FiSettings, 
  FiShield, 
  FiMail,
  FiAlertCircle
} from 'react-icons/fi'

export const AdminSettings = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">System Settings</h2>

      {/* Single Admin System Status */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiShield className="w-5 h-5 text-green-600" />
          Security Configuration
        </h3>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiShield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-900 mb-2">
                🔒 Single Admin System Active
              </h4>
              <p className="text-green-800 mb-4">
                This system is configured for maximum security with a single administrator account. 
                Admin registration has been permanently disabled to prevent unauthorized access.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FiUsers className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Admin Count</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">1</p>
                  <p className="text-xs text-green-700">Single Admin Only</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FiSettings className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Registration</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">DISABLED</p>
                  <p className="text-xs text-green-700">Permanently Locked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Admin Info */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiUsers className="w-5 h-5" />
          Administrator Account
        </h3>
        
        {currentUser && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Administrator'}
                </h4>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  {currentUser.email}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  ✓ Super Administrator
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* System Information */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5" />
          Security Notice
        </h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800 space-y-2">
            <p className="font-medium">Single Admin Security Policy:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Only one administrator account is permitted</li>
              <li>Admin registration is permanently disabled</li>
              <li>Database-level triggers prevent unauthorized admin creation</li>
              <li>System cannot be compromised by multiple admin accounts</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
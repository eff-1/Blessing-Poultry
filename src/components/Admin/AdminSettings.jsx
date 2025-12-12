import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { useNotification } from '../Shared/NotificationSystem'
import { ConfirmationModal } from '../Shared/ConfirmationModal'
import { 
  FiUsers, 
  FiSettings, 
  FiShield, 
  FiTrash2,
  FiUserPlus,
  FiMail,
  FiCalendar,
  FiAlertCircle
} from 'react-icons/fi'

export const AdminSettings = () => {
  const [admins, setAdmins] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [maxAdmins, setMaxAdmins] = useState(2)
  
  const { showSuccess, showError, showWarning } = useNotification()

  useEffect(() => {
    fetchCurrentUser()
    fetchAdmins()
  }, [])

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const fetchAdmins = async () => {
    try {
      // Use Supabase auth admin API to get users
      const { data: { users }, error } = await supabase.auth.admin.listUsers()

      if (error) throw error
      
      // Filter and format users for display (only confirmed users)
      const confirmedUsers = users.filter(user => user.email_confirmed_at)
      const adminUsers = confirmedUsers.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
        created_at: user.created_at,
        role: user.user_metadata?.role || 'admin',
        is_super_admin: user.user_metadata?.role === 'super_admin'
      }))
      
      setAdmins(adminUsers || [])
    } catch (error) {
      console.error('Error fetching admins:', error)
      // Fallback: show current user only if admin API fails
      if (currentUser) {
        setAdmins([{
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Admin User',
          created_at: currentUser.created_at,
          role: 'admin'
        }])
        showWarning('Limited admin view. Some features may not be available.', { 
          title: 'Limited Access' 
        })
      } else {
        showError('Failed to load admin list.', { title: 'Load Error' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAdmin = async () => {
    if (!deleteConfirm) return
    
    try {
      const { id, email } = deleteConfirm
      
      // Prevent self-deletion
      if (id === currentUser?.id) {
        showError('You cannot delete your own admin account', { title: 'Action Not Allowed' })
        setDeleteConfirm(null)
        return
      }
      
      // Delete from auth.users using admin API
      const { error } = await supabase.auth.admin.deleteUser(id)
      
      if (error) throw error
      
      fetchAdmins()
      showSuccess(`Successfully removed admin: ${email}`, {
        title: 'Admin Removed'
      })
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete error:', error)
      showError('Failed to remove admin. Please try again.', {
        title: 'Delete Error'
      })
    }
  }

  const updateMaxAdmins = async (newMax) => {
    if (newMax < admins.length) {
      showWarning(`Cannot set limit below current admin count (${admins.length})`, {
        title: 'Invalid Limit'
      })
      return
    }
    
    setMaxAdmins(newMax)
    showSuccess(`Admin limit updated to ${newMax}`, {
      title: 'Settings Updated'
    })
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
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Admin Settings</h2>

      {/* Admin Limit Settings */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiSettings className="w-5 h-5" />
          Admin Account Limits
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Current Admins</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{admins.length}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiShield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Max Allowed</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{maxAdmins}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiUserPlus className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Available Slots</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{maxAdmins - admins.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Maximum Admin Accounts:
          </label>
          <select
            value={maxAdmins}
            onChange={(e) => updateMaxAdmins(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={2}>2 Admins</option>
            <option value={3}>3 Admins</option>
            <option value={5}>5 Admins</option>
            <option value={10}>10 Admins</option>
          </select>
        </div>
      </motion.div>

      {/* Admin List */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiUsers className="w-5 h-5" />
          Admin Accounts ({admins.length})
        </h3>

        <div className="space-y-4">
          {admins.map((admin, index) => (
            <motion.div
              key={admin.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {admin.full_name?.charAt(0) || admin.email?.charAt(0) || 'A'}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {admin.full_name || 'Admin User'}
                    {admin.id === currentUser?.id && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiMail className="w-4 h-4" />
                      {admin.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      Joined {new Date(admin.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    admin.is_super_admin 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {admin.is_super_admin ? 'Super Admin' : 'Admin'}
                  </span>
                  {admin.is_super_admin && (
                    <span className="text-xs text-purple-600 font-medium">👑 Full Access</span>
                  )}
                </div>
                
                {admin.id !== currentUser?.id && (
                  <button
                    onClick={() => setDeleteConfirm({
                      id: admin.id,
                      email: admin.email,
                      name: admin.full_name || admin.email
                    })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove admin"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {admins.length < maxAdmins && (
          <motion.div
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900">Available Admin Slots</h4>
                <p className="text-sm text-green-700 mt-1">
                  You have {maxAdmins - admins.length} admin slot{maxAdmins - admins.length !== 1 ? 's' : ''} available. 
                  New admins can sign up at <code className="bg-green-100 px-1 rounded">/signup</code>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteAdmin}
        type="danger"
        title="Remove Admin"
        message="Are you sure you want to remove this admin account?"
        itemName={deleteConfirm?.name}
        description="This will permanently delete the admin account and revoke all access. This action cannot be undone."
        confirmText="Remove Admin"
        cancelText="Cancel"
      />
    </div>
  )
}
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useNotification } from '../components/Shared/NotificationSystem'
import { FiMail, FiLock, FiEye, FiEyeOff, FiFeather, FiArrowLeft, FiUser, FiAlertCircle } from 'react-icons/fi'

export const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [adminCount, setAdminCount] = useState(0)
  const [checkingLimit, setCheckingLimit] = useState(true)
  
  const navigate = useNavigate()
  const { showSuccess, showError, showWarning } = useNotification()

  useEffect(() => {
    checkAdminLimit()
  }, [])

  const checkAdminLimit = async () => {
    try {
      // Check how many admins exist in admin_roles table
      const { data, error } = await supabase
        .from('admin_roles')
        .select('id', { count: 'exact', head: true })

      if (error) {
        console.error('Error checking admin count:', error)
        setAdminCount(0)
      } else {
        setAdminCount(data || 0)
      }
    } catch (error) {
      console.error('Error checking admin limit:', error)
      setAdminCount(0)
    } finally {
      setCheckingLimit(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      showError('Please fill in all fields', { title: 'Validation Error' })
      return false
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long', { title: 'Validation Error' })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match', { title: 'Validation Error' })
      return false
    }

    return true
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Check admin limit (max 2 admins)
    if (adminCount >= 2) {
      showError('Maximum number of admin accounts (2) has been reached. Contact existing admin for access.', {
        title: 'Admin Limit Reached'
      })
      return
    }

    setLoading(true)

    try {
      // Sign up the user with email confirmation required
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          },
          emailRedirectTo: `https://blessing-poultry.vercel.app/auth/confirm`,
          // Force email confirmation
          captchaToken: null
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create admin role entry (will be activated after email confirmation)
        const adminRole = adminCount === 0 ? 'super_admin' : 'admin'
        
        const { error: roleError } = await supabase
          .from('admin_roles')
          .insert({
            user_id: authData.user.id,
            role: adminRole
          })

        if (roleError) {
          console.error('Error creating admin role:', roleError)
        }

        // Show success message
        showSuccess(
          `Admin account created! We've sent a verification email to ${formData.email}. Please check your inbox and click the verification link to activate your account.`,
          {
            title: 'Verify Your Email',
            duration: 10000
          }
        )
        
        // Redirect to email sent confirmation page
        navigate('/auth/email-sent')
      }
    } catch (error) {
      console.error('Signup error:', error)
      showError(error.message || 'Failed to create account. Please try again.', {
        title: 'Signup Error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (checkingLimit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking admin availability...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-green-100 rounded-full opacity-20"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 60}%`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors font-medium"
          >
            <FiArrowLeft size={20} />
            Back to Home
          </Link>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <FiFeather className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
            <p className="text-gray-600">Join Blessing Poultries Admin Team</p>
          </div>

          {/* Admin Limit Warning */}
          {adminCount >= 1 && (
            <motion.div
              className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Admin Limit Notice
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {adminCount === 1 
                      ? 'Only 1 more admin account can be created (1/2 used)'
                      : 'Maximum admin accounts reached (2/2 used)'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {adminCount >= 2 ? (
            /* Max Admins Reached */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Admin Limit Reached
              </h3>
              <p className="text-gray-600 mb-6">
                The maximum number of admin accounts (2) has been reached. 
                Please contact an existing administrator for access.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="admin@blessingpoultries.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Admin Account'
                )}
              </motion.button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
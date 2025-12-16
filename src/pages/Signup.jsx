import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useNotification } from '../components/Shared/NotificationSystem'
import { FiLock, FiFeather, FiArrowLeft, FiAlertCircle } from 'react-icons/fi'

export const Signup = () => {

  const [adminCount, setAdminCount] = useState(0)
  const [checkingLimit, setCheckingLimit] = useState(true)
  
  const navigate = useNavigate()
  const { showError } = useNotification()

  useEffect(() => {
    checkAdminLimit()
  }, [])

  const checkAdminLimit = async () => {
    try {
      // Check lockdown status from new admin_lockdown table
      const { data: lockdownData, error: lockdownError } = await supabase
        .rpc('get_admin_lockdown_status')

      if (lockdownError) {
        console.error('Error checking lockdown status:', lockdownError)
        // Fallback to old method
        const { count, error } = await supabase
          .from('admin_roles')
          .select('*', { count: 'exact', head: true })
        
        setAdminCount(count || 0)
      } else if (lockdownData && lockdownData.length > 0) {
        const status = lockdownData[0]
        setAdminCount(status.current_admins || 0)
        
        // If system is locked and admin limit reached, show immediate error
        if (status.is_locked && !status.can_add_admin) {
          showError('Admin registration is currently disabled. Contact administrator for access.', {
            title: 'Registration Disabled',
            duration: 0 // Don't auto-dismiss
          })
        }
      }
    } catch (error) {
      console.error('Error checking admin limit:', error)
      setAdminCount(999) // Set high number to trigger lockdown
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
    
    // REGISTRATION DISABLED - No new admin registrations allowed
    showError('Admin registration is currently disabled. Please contact the administrator for access.', {
      title: 'Registration Disabled',
      duration: 0
    })
    return

    setLoading(true)

    try {
      // Sign up the user with OTP email verification (no redirect needed)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
          // No emailRedirectTo - we'll use OTP verification instead
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
        
        // Redirect to OTP verification page
        navigate('/verify-otp', { 
          state: { email: formData.email }
        })
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

          {/* REGISTRATION DISABLED MESSAGE */}
          <motion.div
            className="mb-6 p-6 bg-orange-50 border border-orange-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <FiAlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold text-orange-800 mb-2">
                  Registration Currently Disabled
                </p>
                <p className="text-sm text-orange-700 mb-3">
                  Admin registration is currently disabled for this system.
                </p>
                <div className="bg-orange-100 rounded-lg p-3 mt-3">
                  <p className="text-xs text-orange-800 font-medium">
                    Need Access?
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Please contact the system administrator for assistance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* REGISTRATION DISABLED */}
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Registration Disabled
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Admin registration is currently not available. 
              Contact the administrator if you need access.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FiArrowLeft className="w-4 h-4" />
                Go to Login
              </Link>
              <p className="text-xs text-gray-500">
                Contact administrator for access requests
              </p>
            </div>
          </div>


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
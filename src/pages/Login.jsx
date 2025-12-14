import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useNotification } from '../components/Shared/NotificationSystem'
import { FiMail, FiLock, FiEye, FiEyeOff, FiFeather, FiArrowLeft } from 'react-icons/fi'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Email not confirmed') || error.message.includes('email_confirmed_at')) {
          showError('Please verify your email address before logging in. Check your inbox for the verification link.', {
            title: 'Email Not Verified'
          })
          return
        } else {
          throw error
        }
      }

      // Additional check for email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        showError('Your email address is not verified. Please check your inbox and click the verification link.', {
          title: 'Email Not Verified'
        })
        await supabase.auth.signOut()
        return
      }

      showSuccess('Welcome back! Redirecting to admin dashboard...', {
        title: 'Login Successful'
      })
      
      setTimeout(() => {
        navigate('/admin')
      }, 1500)
    } catch (error) {
      console.error('Login error:', error)
      showError(error.message || 'Failed to login. Please check your credentials.', {
        title: 'Login Failed'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setResetLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `https://blessing-poultry.vercel.app/reset-password`,
      })

      if (error) throw error

      showSuccess('Password reset email sent! Check your inbox.', {
        title: 'Reset Email Sent'
      })
      setShowForgotPassword(false)
      setResetEmail('')
    } catch (error) {
      console.error('Reset password error:', error)
      showError(error.message || 'Failed to send reset email.', {
        title: 'Reset Failed'
      })
    } finally {
      setResetLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setResetLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: resetEmail,
        options: {
          emailRedirectTo: 'https://blessing-poultry.vercel.app/auth/confirm'
        }
      })

      if (error) throw error

      showSuccess('Verification email sent! Check your inbox and click the link to verify your account.', {
        title: 'Verification Email Sent'
      })
      setShowForgotPassword(false)
      setResetEmail('')
    } catch (error) {
      console.error('Resend verification error:', error)
      showError(error.message || 'Failed to resend verification email.', {
        title: 'Resend Failed'
      })
    } finally {
      setResetLoading(false)
    }
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

        {/* Login Card */}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Welcome back to Blessing Poultries</p>
          </div>

          {!showForgotPassword ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter your password"
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

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
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
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600 text-sm">
                  Enter your email address and we'll send you a reset link
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="admin@blessingpoultries.com"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetEmail('')
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Login
                </button>
                <motion.button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: resetLoading ? 1 : 1.02 }}
                  whileTap={{ scale: resetLoading ? 1 : 0.98 }}
                >
                  {resetLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </div>
            </form>
          )}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Need an admin account?{' '}
              <Link
                to="/signup"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
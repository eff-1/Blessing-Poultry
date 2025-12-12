import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'
import { GiChicken } from 'react-icons/gi'

export const EmailConfirm = () => {
  const [status, setStatus] = useState('loading') // 'loading', 'success', 'error'
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    handleEmailConfirmation()
  }, [])

  const handleEmailConfirmation = async () => {
    try {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (!token || type !== 'signup') {
        setStatus('error')
        setMessage('Invalid confirmation link.')
        return
      }

      // Verify the email confirmation token
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      })

      if (error) {
        setStatus('error')
        setMessage(error.message || 'Failed to verify email.')
        return
      }

      if (data.user) {
        setStatus('success')
        setMessage('Email verified successfully! You can now login to your admin account.')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login?verified=true')
        }, 3000)
      }
    } catch (error) {
      console.error('Email confirmation error:', error)
      setStatus('error')
      setMessage('An unexpected error occurred.')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <FiLoader className="w-12 h-12 text-blue-600 animate-spin" />
      case 'success':
        return <FiCheckCircle className="w-12 h-12 text-green-600" />
      case 'error':
        return <FiXCircle className="w-12 h-12 text-red-600" />
      default:
        return <FiLoader className="w-12 h-12 text-blue-600 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'from-green-50 via-white to-emerald-50'
      case 'error':
        return 'from-red-50 via-white to-pink-50'
      default:
        return 'from-blue-50 via-white to-indigo-50'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getStatusColor()} flex items-center justify-center p-4`}>
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <GiChicken className="w-10 h-10 text-white" />
        </motion.div>

        {/* Status Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {getStatusIcon()}
        </motion.div>

        <motion.h1
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {status === 'loading' && 'Verifying Email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.p>

        {status === 'success' && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-green-800">
              Redirecting to login page in 3 seconds...
            </p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.button
            onClick={() => navigate('/signup')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Try Signing Up Again
          </motion.button>
        )}

        {status === 'success' && (
          <motion.button
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Go to Login
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'

export const EmailConfirm = () => {
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'signup') {
          throw new Error('Invalid confirmation link')
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) throw error

        if (data.user) {
          setConfirmed(true)
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        }
      } catch (error) {
        console.error('Email confirmation error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 text-center max-w-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {loading && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">Confirming Your Email...</h1>
            <p className="text-gray-600">Please wait while we verify your account.</p>
          </>
        )}

        {!loading && confirmed && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">Email Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your admin account has been successfully verified. You can now log in to access the admin dashboard.
            </p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        )}

        {!loading && error && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiXCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
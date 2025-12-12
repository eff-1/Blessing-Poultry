import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi'
import { GiChicken } from 'react-icons/gi'

export const EmailSent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-green-100 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

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

        {/* Email Icon */}
        <motion.div
          className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <FiMail className="w-8 h-8 text-blue-600" />
        </motion.div>

        <motion.h1
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Check Your Email
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          We've sent a verification link to your email address. Please click the link in the email to verify your admin account and complete the setup.
        </motion.p>

        <motion.div
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-green-800">
            <strong>Next Steps:</strong>
            <br />
            1. Check your email inbox (and spam folder)
            <br />
            2. Click the verification link
            <br />
            3. You'll be redirected to login
            <br />
            4. Access your admin dashboard
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FiRefreshCw className="w-4 h-4" />
            Resend Email
          </button>

          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </motion.div>

        <motion.p
          className="text-xs text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Didn't receive the email? Check your spam folder or contact support.
        </motion.p>
      </motion.div>
    </div>
  )
}
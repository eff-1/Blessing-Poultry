import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'

export const EmailSent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
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

        {/* Email Sent Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <FiMail className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
          
          <div className="space-y-4 text-gray-600">
            <p>
              We've sent a verification email to your inbox. Please check your email and click the verification link to activate your admin account.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-green-900 mb-1">Next Steps:</p>
                  <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the verification link in the email</li>
                    <li>Return to login once verified</li>
                  </ol>
                </div>
              </div>
            </div>

            <p className="text-sm">
              Didn't receive the email? Check your spam folder or{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                try signing up again
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
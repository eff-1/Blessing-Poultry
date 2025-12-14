import { motion } from 'framer-motion'
import { FiLoader } from 'react-icons/fi'

export const LoadingButton = ({ 
  loading, 
  children, 
  className = '', 
  variant = 'primary',
  disabled,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700"
  }

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading || disabled}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <FiLoader className="w-4 h-4 animate-spin" />
      )}
      {children}
    </motion.button>
  )
}
import { motion } from 'framer-motion'

export const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '' }) => {
  const baseClass = variant === 'primary' ? 'btn-primary-custom' : 'btn-outline-custom'
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  )
}

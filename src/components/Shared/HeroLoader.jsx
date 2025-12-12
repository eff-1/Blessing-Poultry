import { motion } from 'framer-motion'
import { GiChicken } from 'react-icons/gi'

export const HeroLoader = () => {
  return (
    <div className="hero-loader">
      <div className="hero-loader-content">
        {/* Animated Logo */}
        <motion.div
          className="hero-loader-logo"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="logo-icon"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <GiChicken size={40} />
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="hero-loader-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Blessing Poultries
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="hero-loader-tagline"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Fresh • Healthy • Naturally Raised
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          className="hero-loader-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <div className="loading-spinner">
            <motion.div
              className="spinner-ring"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
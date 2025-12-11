import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { Gift, Sparkles, ShoppingBag, Zap, Star, Heart } from 'lucide-react'

export const HeroPreview = ({ hero, onClose }) => {
  if (!hero) return null

  const getIcon = (iconName) => {
    const icons = {
      Gift,
      Sparkles,
      ShoppingBag,
      Zap,
      Star,
      Heart
    }
    return icons[iconName] || Gift
  }

  const scrollToProducts = () => {
    // Preview only - no actual scrolling
    console.log('Would scroll to products')
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full h-full max-w-7xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-colors"
        >
          <FiX className="text-xl" />
        </button>

        {/* Hero Preview */}
        <div className="relative w-full h-full bg-gradient-to-br from-red-900 via-green-900 to-red-950 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={hero.background_image || '/images/hero/christmas-banner.jpg'} 
              alt="Hero background"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-green-900/70 to-red-950/80"></div>
          </div>

          {/* Animated Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center h-full text-center">
            
            {/* Floating Badge */}
            <div className="mb-4 sm:mb-6 animate-bounce">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full shadow-2xl">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse" />
                <span className="font-bold text-xs sm:text-sm tracking-wider">LIMITED TIME OFFER</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse" />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 sm:mb-4 md:mb-6 leading-none">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 animate-gradient">
                {hero.title || 'CHRISTMAS'}
              </span>
              <span className="block text-white drop-shadow-2xl mt-1 sm:mt-2">
                {hero.subtitle || 'MEGA SALE'}
              </span>
            </h1>

            {/* Subheadline */}
            <div className="mb-4 sm:mb-6 md:mb-8 overflow-hidden">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-200 font-semibold animate-slideUp tracking-wide">
                {hero.description || 'Up to'} <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-yellow-400 inline-block animate-pulse">{hero.discount_text || '70% OFF'}</span> on Everything!
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
              {(hero.features || []).map((feature, i) => {
                const IconComponent = getIcon(feature.icon)
                return (
                  <div 
                    key={i}
                    className="flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="font-semibold text-xs sm:text-sm md:text-base">{feature.text}</span>
                  </div>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12 w-full max-w-md sm:max-w-none">
              <button 
                onClick={scrollToProducts}
                className="group relative px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-full shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
                  {hero.cta_primary || 'Shop Now'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-white/10 backdrop-blur-md border-2 border-white text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-full hover:bg-white hover:text-red-900 transform hover:scale-110 transition-all duration-300 shadow-2xl">
                {hero.cta_secondary || 'View Deals'}
              </button>
            </div>

            {/* Countdown Timer */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
              <p className="text-yellow-300 font-semibold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">🎄 Sale Ends In:</p>
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                {[
                  { label: 'DAYS', value: hero.countdown_days || 0 },
                  { label: 'HRS', value: hero.countdown_hours || 0 },
                  { label: 'MIN', value: hero.countdown_minutes || 0 },
                  { label: 'SEC', value: hero.countdown_seconds || 0 }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg md:rounded-xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <span className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 font-semibold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute top-16 sm:top-20 left-4 sm:left-10 animate-float">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400 opacity-70" />
          </div>
          <div className="absolute top-32 sm:top-40 right-8 sm:right-20 animate-float">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-400 opacity-70" />
          </div>
          <div className="absolute bottom-32 sm:bottom-40 left-8 sm:left-20 animate-float">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-green-400 opacity-70" />
          </div>
          <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-10 animate-float">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-400 opacity-70" />
          </div>

          {/* Bottom Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 md:h-40 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  )
}
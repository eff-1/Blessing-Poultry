import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import ChristmasHero from '../Landing/ChristmasHero'
import { RamadanHero } from '../Landing/RamadanHero'
import EasterHero from '../Landing/EasterHero'
import NormalSeasonHero from '../Landing/NormalSeasonHero'

export const HeroPreview = ({ hero, onClose }) => {
  if (!hero) return null

  const renderHeroComponent = () => {
    switch (hero.name) {
      case 'christmas':
        return <ChristmasHero />
      case 'ramadan':
        return <RamadanHero />
      case 'easter':
        return <EasterHero />
      case 'normal':
        return <NormalSeasonHero />
      default:
        return <NormalSeasonHero />
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
        >
          <FiX className="text-xl" />
        </button>

        {/* Preview Label */}
        <div className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
          Preview: {hero.title}
        </div>

        {/* Hero Component Preview */}
        <div className="w-full">
          {renderHeroComponent()}
        </div>
      </div>
    </motion.div>
  )
}
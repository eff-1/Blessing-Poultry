import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSave, FiImage } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { HeroPreview } from './HeroPreview'
import { HeroEditor } from './HeroEditor'

export const HeroManager = () => {
  const [heroes, setHeroes] = useState([])
  const [activeHero, setActiveHero] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeroes()
  }, [])

  const fetchHeroes = async () => {
    setLoading(true)
    const { data } = await supabase.from('heroes').select('*').order('created_at', { ascending: false })
    setHeroes(data || [])
    setLoading(false)
  }

  const handleCreateHero = () => {
    setActiveHero({
      id: null,
      name: 'New Hero',
      theme: 'christmas',
      title: 'CHRISTMAS',
      subtitle: 'MEGA SALE',
      description: 'Up to 70% OFF on Everything!',
      discount_text: '70% OFF',
      countdown_days: 23,
      countdown_hours: 45,
      countdown_minutes: 12,
      countdown_seconds: 38,
      cta_primary: 'Shop Now',
      cta_secondary: 'View Deals',
      background_image: '/images/hero/christmas-banner.jpg',
      is_active: false,
      features: [
        { icon: 'Gift', text: 'Free Gift Wrap' },
        { icon: 'Sparkles', text: 'Flash Deals' },
        { icon: 'Heart', text: 'Loved by 100K+' }
      ]
    })
    setShowEditor(true)
  }

  const handleEditHero = (hero) => {
    setActiveHero(hero)
    setShowEditor(true)
  }

  const handleDeleteHero = async (heroId) => {
    if (window.confirm('Are you sure you want to delete this hero?')) {
      await supabase.from('heroes').delete().eq('id', heroId)
      fetchHeroes()
    }
  }

  const handleActivateHero = async (heroId) => {
    await supabase.from('heroes').update({ is_active: false }).neq('id', 0)
    await supabase.from('heroes').update({ is_active: true }).eq('id', heroId)
    fetchHeroes()
  }

  const handlePreview = (hero) => {
    setActiveHero(hero)
    setShowPreview(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Management</h1>
          <p className="text-gray-600 mt-1">Create and manage homepage hero sections</p>
        </div>
        
        <motion.button
          onClick={handleCreateHero}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus />
          <span>Create New Hero</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Heroes</h2>
        </div>
        
        <div className="p-6">
          {heroes.length === 0 ? (
            <div className="text-center py-12">
              <FiImage className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No heroes created yet</h3>
              <p className="text-gray-600 mb-6">Create your first hero to get started</p>
              <button
                onClick={handleCreateHero}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create First Hero
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroes.map((hero) => (
                <motion.div
                  key={hero.id}
                  className={`border rounded-lg p-4 ${
                    hero.is_active ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500">{hero.theme} Theme</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{hero.name}</h3>
                      {hero.is_active && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{hero.theme} theme</p>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handlePreview(hero)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        <FiEye className="text-xs" />
                        Preview
                      </button>
                      
                      <button
                        onClick={() => handleEditHero(hero)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        <FiEdit className="text-xs" />
                        Edit
                      </button>
                      
                      {!hero.is_active && (
                        <button
                          onClick={() => handleActivateHero(hero.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                        >
                          <FiSave className="text-xs" />
                          Activate
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteHero(hero.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <HeroEditor
          hero={activeHero}
          onClose={() => setShowEditor(false)}
          onSave={() => {
            setShowEditor(false)
            fetchHeroes()
          }}
        />
      )}
      
      {showPreview && (
        <HeroPreview
          hero={activeHero}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
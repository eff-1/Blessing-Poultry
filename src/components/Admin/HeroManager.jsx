import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSave, FiImage, FiPlay, FiPause, FiClock, FiSettings } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { HeroPreview } from './HeroPreview'
import { HeroEditor } from './HeroEditor'
import { useNotification } from '../Shared/NotificationSystem'

export const HeroManager = () => {
  const [heroes, setHeroes] = useState([])
  const [activeHero, setActiveHero] = useState(null)
  const [currentActiveHero, setCurrentActiveHero] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(true)
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    fetchHeroes()
    fetchCurrentActiveHero()
    fetchSettings()
  }, [])

  const fetchHeroes = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('heroes')
        .select(`
          *,
          hero_features (
            icon,
            text,
            display_order
          )
        `)
        .order('name', { ascending: true })
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched heroes:', data) // Debug log
      
      // Transform the data to include features array
      const transformedData = data?.map(hero => ({
        ...hero,
        features: hero.hero_features
          ?.sort((a, b) => a.display_order - b.display_order)
          ?.map(f => ({ icon: f.icon, text: f.text })) || []
      })) || []
      
      console.log('Transformed heroes:', transformedData) // Debug log
      setHeroes(transformedData)
      
    } catch (error) {
      console.error('Error fetching heroes:', error)
      showError('Failed to load heroes. Please refresh the page.')
    }
    setLoading(false)
  }

  const createDefaultHeroes = async () => {
    try {
      const defaultHeroes = [
        {
          name: 'christmas',
          title: 'CHRISTMAS',
          subtitle: 'MEGA SALE',
          description: '50% OFF',
          discount_text: '50% OFF',
          background_image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200',
          start_date: '2024-12-01',
          end_date: '2024-12-26',
          is_active: true
        },
        {
          name: 'normal',
          title: 'Blessing Poultries',
          subtitle: 'Fresh, Healthy, Naturally Raised Poultry',
          description: 'Trusted poultry production and expert bird treatments for over 10 years in Ota',
          discount_text: 'Quality Assured',
          background_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200',
          is_active: false
        },
        {
          name: 'ramadan',
          title: 'Blessed Ramadan',
          subtitle: 'Fresh Poultry',
          description: 'Premium halal poultry for your blessed family',
          discount_text: 'UP TO 40% OFF',
          background_image: '/images/decorative/ramadan-bannerbg.jpeg',
          start_date: '2025-02-28',
          end_date: '2025-04-12',
          is_active: false
        },
        {
          name: 'easter',
          title: 'Egg-citing Deals',
          subtitle: 'On Fresh Chicken & Turkey',
          description: 'Farm Fresh for the Feast',
          discount_text: 'GET 15% OFF',
          background_image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=1200',
          start_date: '2025-03-30',
          end_date: '2025-04-21',
          is_active: false
        }
      ]

      // Insert heroes
      const { data: insertedHeroes, error: heroError } = await supabase
        .from('heroes')
        .insert(defaultHeroes)
        .select()

      if (heroError) throw heroError

      // Insert default features for each hero
      const defaultFeatures = [
        // Christmas features
        { hero_name: 'christmas', icon: 'Gift', text: 'Free Gift', display_order: 1 },
        { hero_name: 'christmas', icon: 'Sparkles', text: 'Flash Deals', display_order: 2 },
        // Normal features
        { hero_name: 'normal', icon: 'Heart', text: 'Fresh Daily', display_order: 1 },
        { hero_name: 'normal', icon: 'Star', text: 'Quality Assured', display_order: 2 },
        // Ramadan features
        { hero_name: 'ramadan', icon: 'Gift', text: 'Free Gift', display_order: 1 },
        { hero_name: 'ramadan', icon: 'Sparkles', text: 'Flash Deals', display_order: 2 },
        // Easter features
        { hero_name: 'easter', icon: 'Gift', text: 'Free Gift', display_order: 1 },
        { hero_name: 'easter', icon: 'Sparkles', text: 'Flash Deals', display_order: 2 }
      ]

      // Get hero IDs and insert features
      for (const feature of defaultFeatures) {
        const hero = insertedHeroes.find(h => h.name === feature.hero_name)
        if (hero) {
          await supabase
            .from('hero_features')
            .insert({
              hero_id: hero.id,
              icon: feature.icon,
              text: feature.text,
              display_order: feature.display_order
            })
        }
      }

      showSuccess('Default heroes created successfully!', { title: 'Heroes Initialized' })
    } catch (error) {
      console.error('Error creating default heroes:', error)
      showError('Failed to create default heroes.')
    }
  }

  const fetchCurrentActiveHero = async () => {
    try {
      const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .eq('is_active', true)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }
      
      setCurrentActiveHero(data || null)
    } catch (error) {
      console.error('Error fetching active hero:', error)
      setCurrentActiveHero(null)
    }
  }

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('hero_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'auto_switch_enabled')
        .single()
      
      setAutoSwitchEnabled(data?.setting_value === 'true')
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const activateHero = async (heroName) => {
    try {
      // Simple approach: deactivate all, then activate the selected one
      const { error: deactivateError } = await supabase
        .from('heroes')
        .update({ is_active: false })
        .neq('id', 0) // Update all rows
      
      if (deactivateError) throw deactivateError
      
      const { error: activateError } = await supabase
        .from('heroes')
        .update({ is_active: true })
        .eq('name', heroName)
      
      if (activateError) throw activateError
      
      await fetchHeroes()
      await fetchCurrentActiveHero()
      
      showSuccess(`${heroName} hero is now active!`, { title: 'Hero Activated' })
    } catch (error) {
      console.error('Error activating hero:', error)
      showError('Failed to activate hero. Please try again.', { title: 'Activation Error' })
    }
  }

  const enableAutoSwitching = async () => {
    try {
      const { error } = await supabase.rpc('enable_auto_hero_switching')
      if (error) throw error
      
      await fetchHeroes()
      await fetchCurrentActiveHero()
      
      showSuccess('Auto hero switching enabled!', { title: 'Auto Mode Enabled' })
    } catch (error) {
      console.error('Error enabling auto switching:', error)
      showError('Failed to enable auto switching.', { title: 'Auto Mode Error' })
    }
  }

  const toggleAutoSwitch = async () => {
    try {
      const newValue = !autoSwitchEnabled
      const { error } = await supabase
        .from('hero_settings')
        .update({ setting_value: newValue.toString() })
        .eq('setting_key', 'auto_switch_enabled')
      
      if (error) throw error
      
      setAutoSwitchEnabled(newValue)
      showSuccess(`Auto switching ${newValue ? 'enabled' : 'disabled'}!`)
    } catch (error) {
      console.error('Error toggling auto switch:', error)
      showError('Failed to update auto switch setting.')
    }
  }

  const handleCreateHero = () => {
    setActiveHero({
      id: null,
      name: 'new-hero',
      title: 'NEW HERO',
      subtitle: 'SPECIAL OFFER',
      description: '50% OFF',
      discount_text: '50% OFF',
      cta_primary: 'Shop Now',
      background_image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200',
      start_date: null,
      end_date: null,
      is_active: false,
      features: [
        { icon: 'Gift', text: 'Free Gift' },
        { icon: 'Sparkles', text: 'Flash Deals' }
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
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hero Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Create and manage seasonal homepage heroes</p>
          {currentActiveHero && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-500">Currently Active:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {currentActiveHero.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {heroes.length < 4 && (
            <motion.button
              onClick={createDefaultHeroes}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus size={16} />
              <span>Create Missing Heroes</span>
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSettings size={16} />
            <span>Settings</span>
          </motion.button>
          
          <motion.button
            onClick={handleCreateHero}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus />
            <span>Create New Hero</span>
          </motion.button>
        </div>
      </div>

      {/* Auto Switch Status */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${autoSwitchEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <div>
              <h3 className="font-medium text-gray-900">
                Auto Season Switching: {autoSwitchEnabled ? 'Enabled' : 'Disabled'}
              </h3>
              <p className="text-sm text-gray-600">
                {autoSwitchEnabled 
                  ? 'Heroes will automatically switch based on seasons and dates'
                  : 'Manual hero selection is active'
                }
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={enableAutoSwitching}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlay size={14} />
              Auto Mode
            </motion.button>
            
            <motion.button
              onClick={toggleAutoSwitch}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                autoSwitchEnabled 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {autoSwitchEnabled ? <FiPause size={14} /> : <FiPlay size={14} />}
              {autoSwitchEnabled ? 'Disable' : 'Enable'}
            </motion.button>
          </div>
        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {heroes.map((hero) => (
                <motion.div
                  key={hero.id}
                  className={`border rounded-xl p-4 ${
                    hero.is_active ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                  } shadow-sm hover:shadow-md transition-shadow`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium">{hero.name}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{hero.title}</h3>
                      {hero.is_active && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs md:text-sm text-gray-600 truncate">{hero.subtitle}</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEditHero(hero)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        <FiEdit className="w-3 h-3" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => activateHero(hero.name)}
                        className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          currentActiveHero?.name === hero.name
                            ? 'bg-green-100 text-green-800 cursor-default'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                        disabled={currentActiveHero?.name === hero.name}
                      >
                        <FiPlay className="w-3 h-3" />
                        {currentActiveHero?.name === hero.name ? 'Active' : 'Activate'}
                      </button>
                    </div>
                    
                    {/* Countdown Timer */}
                    {hero.countdown_end && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiClock className="w-3 h-3" />
                        <span>Expires: {new Date(hero.countdown_end).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handlePreview(hero)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        <FiEye className="w-3 h-3" />
                        Preview
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteHero(hero.id)}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      Delete
                    </button>
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
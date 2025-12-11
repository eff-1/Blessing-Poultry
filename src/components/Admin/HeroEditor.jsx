import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiSave, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'

export const HeroEditor = ({ hero, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    theme: 'christmas',
    title: '',
    subtitle: '',
    description: '',
    discount_text: '',
    countdown_days: 0,
    countdown_hours: 0,
    countdown_minutes: 0,
    countdown_seconds: 0,
    cta_primary: 'Shop Now',
    cta_secondary: 'View Deals',
    background_image: '',
    features: []
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (hero) {
      setFormData({
        name: hero.name || '',
        theme: hero.theme || 'christmas',
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        description: hero.description || '',
        discount_text: hero.discount_text || '',
        countdown_days: hero.countdown_days || 0,
        countdown_hours: hero.countdown_hours || 0,
        countdown_minutes: hero.countdown_minutes || 0,
        countdown_seconds: hero.countdown_seconds || 0,
        cta_primary: hero.cta_primary || 'Shop Now',
        cta_secondary: hero.cta_secondary || 'View Deals',
        background_image: hero.background_image || '',
        features: hero.features || []
      })
    }
  }, [hero])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { icon: 'Gift', text: 'New Feature' }]
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (hero.id) {
        // Update existing hero
        await supabase
          .from('heroes')
          .update(formData)
          .eq('id', hero.id)
      } else {
        // Create new hero
        await supabase
          .from('heroes')
          .insert([formData])
      }
      onSave()
    } catch (error) {
      console.error('Error saving hero:', error)
    } finally {
      setSaving(false)
    }
  }

  const themes = [
    { id: 'christmas', name: 'Christmas', colors: ['#dc2626', '#16a34a', '#eab308'] },
    { id: 'newyear', name: 'New Year', colors: ['#7c3aed', '#f59e0b', '#ef4444'] },
    { id: 'ramadan', name: 'Ramadan', colors: ['#059669', '#d97706', '#7c2d12'] },
    { id: 'valentine', name: 'Valentine', colors: ['#e11d48', '#ec4899', '#f97316'] },
    { id: 'easter', name: 'Easter', colors: ['#f59e0b', '#10b981', '#8b5cf6'] },
    { id: 'summer', name: 'Summer', colors: ['#f97316', '#06b6d4', '#84cc16'] }
  ]

  const iconOptions = ['Gift', 'Sparkles', 'Heart', 'Star', 'Zap', 'ShoppingBag', 'Truck', 'Shield']

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {hero.id ? 'Edit Hero' : 'Create New Hero'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Christmas Sale 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hero Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., CHRISTMAS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., MEGA SALE"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Up to 70% OFF on Everything!"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Text
              </label>
              <input
                type="text"
                value={formData.discount_text}
                onChange={(e) => handleInputChange('discount_text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 70% OFF"
              />
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Countdown Timer</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                <input
                  type="number"
                  value={formData.countdown_days}
                  onChange={(e) => handleInputChange('countdown_days', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                <input
                  type="number"
                  value={formData.countdown_hours}
                  onChange={(e) => handleInputChange('countdown_hours', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="23"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                <input
                  type="number"
                  value={formData.countdown_minutes}
                  onChange={(e) => handleInputChange('countdown_minutes', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="59"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
                <input
                  type="number"
                  value={formData.countdown_seconds}
                  onChange={(e) => handleInputChange('countdown_seconds', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Call-to-Action Buttons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={formData.cta_primary}
                  onChange={(e) => handleInputChange('cta_primary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={formData.cta_secondary}
                  onChange={(e) => handleInputChange('cta_secondary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <button
                onClick={addFeature}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <FiPlus className="text-sm" />
                Add Feature
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <select
                    value={feature.icon}
                    onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={feature.text}
                    onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Feature text"
                  />
                  
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image URL
            </label>
            <input
              type="text"
              value={formData.background_image}
              onChange={(e) => handleInputChange('background_image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="/images/hero/background.jpg"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <FiSave />
            {saving ? 'Saving...' : 'Save Hero'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
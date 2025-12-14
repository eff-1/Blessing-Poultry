import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../Shared/Button'
import { useNotification } from '../Shared/NotificationSystem'

export const ManageContact = () => {
  const [formData, setFormData] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
  })
  const [contactId, setContactId] = useState(null)
  
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    const { data } = await supabase.from('contact_info').select('*').single()
    if (data) {
      // Ensure all values are strings, not null
      setFormData({
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        email: data.email || '',
        address: data.address || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
      })
      setContactId(data.id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (contactId) {
        await supabase.from('contact_info').update(formData).eq('id', contactId)
      } else {
        const { data } = await supabase.from('contact_info').insert([formData]).select().single()
        setContactId(data.id)
      }

      showSuccess('Contact information updated successfully!', {
        title: 'Contact Updated'
      })
    } catch (error) {
      console.error('Error updating contact:', error)
      showError('Failed to update contact information. Please try again.', {
        title: 'Update Error'
      })
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g., +234 801 234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="e.g., 2348012345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="info@blessingpoultries.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Your farm location"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Profile</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Profile</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                placeholder="https://twitter.com/yourprofile"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full sm:w-auto">
            Save Contact Information
          </Button>
        </div>
      </form>
    </div>
  )
}

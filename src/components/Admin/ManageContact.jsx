import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../Shared/Button'

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

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    const { data } = await supabase.from('contact_info').select('*').single()
    if (data) {
      setFormData(data)
      setContactId(data.id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (contactId) {
      await supabase.from('contact_info').update(formData).eq('id', contactId)
    } else {
      const { data } = await supabase.from('contact_info').insert([formData]).select().single()
      setContactId(data.id)
    }

    alert('Contact information updated!')
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Manage Contact Information</h2>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div>
            <label>WhatsApp</label>
            <input
              type="text"
              className="form-control"
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="e.g., 2348012345678"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div>
            <label>Facebook URL</label>
            <input
              type="url"
              className="form-control"
              value={formData.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </div>
          <div>
            <label>Instagram URL</label>
            <input
              type="url"
              className="form-control"
              value={formData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </div>
          <div>
            <label>Twitter URL</label>
            <input
              type="url"
              className="form-control"
              value={formData.twitter}
              onChange={(e) => handleChange('twitter', e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: '24px' }}>
          <Button type="submit">Save Contact Info</Button>
        </div>
      </form>
    </div>
  )
}

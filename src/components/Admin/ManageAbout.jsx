import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../Shared/Button'
import { uploadImage } from '../../lib/utils'

export const ManageAbout = () => {
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [aboutId, setAboutId] = useState(null)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    const { data } = await supabase.from('about').select('*').single()
    if (data) {
      setContent(data.content)
      setCurrentImage(data.image_url)
      setAboutId(data.id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = currentImage

    if (imageFile) {
      imageUrl = await uploadImage(supabase, 'about-images', imageFile)
    }

    const aboutData = { content, image_url: imageUrl }

    if (aboutId) {
      await supabase.from('about').update(aboutData).eq('id', aboutId)
    } else {
      const { data } = await supabase.from('about').insert([aboutData]).select().single()
      setAboutId(data.id)
    }

    alert('About section updated!')
    fetchAbout()
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Manage About Section</h2>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label>About Content</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Tell your farm's story..."
            required
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label>About Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {currentImage && (
            <img src={currentImage} alt="Current" className="image-preview" />
          )}
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}

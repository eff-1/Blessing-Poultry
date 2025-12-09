import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { uploadImage } from '../../lib/utils'
import { Button } from '../Shared/Button'
import { MdDelete, MdCloudUpload } from 'react-icons/md'

export const ManageGallery = () => {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    setImages(data || [])
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)

    for (const file of files) {
      const imageUrl = await uploadImage(supabase, 'gallery-images', file)
      await supabase.from('gallery').insert([{ image_url: imageUrl }])
    }

    setUploading(false)
    fetchGallery()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this image?')) {
      await supabase.from('gallery').delete().eq('id', id)
      fetchGallery()
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Manage Gallery</h2>

      <div className="image-upload-zone" style={{ marginBottom: '32px' }}>
        <MdCloudUpload size={64} color="var(--primary-green)" />
        <h4>Upload Images</h4>
        <p>Click or drag images here</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          style={{ display: 'none' }}
          id="gallery-upload"
        />
        <label htmlFor="gallery-upload">
          <Button as="span">{uploading ? 'Uploading...' : 'Select Images'}</Button>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}
          >
            <img src={img.image_url} alt="Gallery" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <button
              className="action-btn delete"
              onClick={() => handleDelete(img.id)}
              style={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <MdDelete />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

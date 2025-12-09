import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { IoClose } from 'react-icons/io5'

export const Gallery = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    setImages(data || [])
  }

  return (
    <section id="gallery" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 className="section-title">Gallery</h2>
          <p className="section-subtitle">A glimpse into our farm</p>
        </motion.div>

        <div className="gallery-grid">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(img)}
            >
              <img src={img.image_url} alt={img.caption || 'Gallery'} />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedImage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  zIndex: 2000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <IoClose
                  size={48}
                  color="white"
                  style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }}
                />
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  src={selectedImage.image_url}
                  alt={selectedImage.caption}
                  style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px' }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Container>
    </section>
  )
}

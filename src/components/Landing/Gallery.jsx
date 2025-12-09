import { useState, useEffect } from 'react'
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
    
    // If no images from database, use local product images as fallback
    if (!data || data.length === 0) {
      const localImages = [
        { id: 1, image_url: '/images/products/eggs/egg-1.jpg', caption: 'Fresh Farm Eggs' },
        { id: 2, image_url: '/images/products/eggs/egg-2.jpg', caption: 'Brown Eggs' },
        { id: 3, image_url: '/images/products/broilers/broiler-1.jpg', caption: 'Healthy Broilers' },
        { id: 4, image_url: '/images/products/broilers/broiler-2.jpg', caption: 'Quality Chickens' },
        { id: 5, image_url: '/images/products/layers/layer-1.jpg', caption: 'Layer Hens' },
        { id: 6, image_url: '/images/products/layers/layer-2.jpg', caption: 'Productive Layers' },
        { id: 7, image_url: '/images/products/chicks/chick-1.jpg', caption: 'Day-Old Chicks' },
        { id: 8, image_url: '/images/products/chicks/chick-2.jpg', caption: 'Healthy Chicks' },
        { id: 9, image_url: '/images/products/feeds/feed-1.jpg', caption: 'Quality Feeds' },
        { id: 10, image_url: '/images/about/farm-1.jpg', caption: 'Our Farm' },
        { id: 11, image_url: '/images/about/farm-2.jpg', caption: 'Farm Facilities' },
        { id: 12, image_url: '/images/about/farm-3.jpg', caption: 'Clean Environment' },
      ]
      setImages(localImages)
    } else {
      setImages(data)
    }
  }

  return (
    <section id="gallery" className="gallery-section-new">
      <div className="container-custom">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="gallery-badge">Gallery</span>
          <h2 className="gallery-title">A Glimpse Into Our Farm</h2>
          <p className="gallery-subtitle">
            Explore our facilities, products, and the care we put into every aspect of our farm
          </p>
        </motion.div>

        <div className="gallery-grid-new">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              className="gallery-item-new"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(img)}
              whileHover={{ y: -8 }}
            >
              <div className="gallery-image-wrapper">
                <img src={img.image_url} alt={img.caption || 'Gallery'} />
                <div className="gallery-overlay">
                  <span className="gallery-caption">{img.caption || 'View Image'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="gallery-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <IoClose
                size={48}
                color="white"
                className="lightbox-close"
              />
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={selectedImage.image_url}
                alt={selectedImage.caption}
                className="lightbox-image"
                onClick={(e) => e.stopPropagation()}
              />
              {selectedImage.caption && (
                <motion.div
                  className="lightbox-caption"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {selectedImage.caption}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

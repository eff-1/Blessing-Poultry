import { motion } from 'framer-motion'
import { formatPrice } from '../../lib/utils'
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export const ProductCard = ({ product }) => {
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    fetchWhatsApp()
  }, [])

  const fetchWhatsApp = async () => {
    const { data } = await supabase.from('contact_info').select('whatsapp').single()
    setWhatsapp(data?.whatsapp || '2348012345678')
  }

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hello! I'm interested in ordering:\n\n` +
      `Product: ${product.name}\n` +
      `Price: ${formatPrice(product.price)}\n` +
      `Category: ${product.category}\n\n` +
      `Please provide more details.`
    )
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank')
  }

  return (
    <motion.div
      className="product-card-new"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <div className="product-image-wrapper">
        <img src={product.image_url} alt={product.name} className="product-image" />
        <span className={`product-badge ${product.in_stock ? 'badge-in-stock' : 'badge-out-stock'}`}>
          {product.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
        </span>
        {product.in_stock && (
          <div className="product-overlay">
            <motion.button
              className="quick-order-btn"
              onClick={handleWhatsAppOrder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWhatsapp size={20} />
              <span>Get Yours Now</span>
            </motion.button>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h4 className="product-name">{product.name}</h4>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="price-label">Price:</span>
            <span className="price-value">{formatPrice(product.price)}</span>
          </div>
          
          {product.in_stock && (
            <motion.button
              className="order-btn"
              onClick={handleWhatsAppOrder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

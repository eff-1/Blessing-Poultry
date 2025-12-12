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
    // Check if product is out of stock
    if (product.stock_status === 'out_of_stock' || !product.in_stock) {
      // Show popup message for out of stock
      alert(`Sorry, "${product.name}" is currently out of stock. Please check back later or contact us for availability updates.`)
      return
    }

    const stockInfo = product.stock_status === 'few_left' 
      ? `\nStock: Only ${product.stock_quantity || 'few'} left!` 
      : product.stock_status === 'in_stock' 
      ? '\nStock: Available' 
      : '\nStock: Out of stock'
    
    const message = encodeURIComponent(
      `🐔 *BLESSING POULTRIES ORDER INQUIRY*\n\n` +
      `📦 *Product:* ${product.name}\n` +
      `💰 *Price:* ${formatPrice(product.price)}\n` +
      `📂 *Category:* ${product.category}${stockInfo}\n` +
      `📝 *Description:* ${product.description || 'Premium quality product'}\n\n` +
      `🔗 *Product Image:* ${product.image_url}\n\n` +
      `Hi! I'm interested in ordering this product. Please provide more details about availability, delivery, and payment options.\n\n` +
      `Thank you! 🙏`
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
        <span className={`product-badge ${
          product.stock_status === 'in_stock' ? 'badge-in-stock' : 
          product.stock_status === 'few_left' ? 'badge-few-left' : 
          'badge-out-stock'
        }`}>
          {product.stock_status === 'in_stock' ? '✓ In Stock' : 
           product.stock_status === 'few_left' ? `⚡ Only ${product.stock_quantity || 'few'} left!` : 
           '✗ Out of Stock'}
        </span>
        {(product.in_stock && product.stock_status !== 'out_of_stock') && (
          <div className="product-overlay">
            <motion.button
              className="quick-order-btn"
              onClick={handleWhatsAppOrder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWhatsapp size={20} />
              <span>Buy Now</span>
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
          
          {(product.in_stock && product.stock_status !== 'out_of_stock') && (
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

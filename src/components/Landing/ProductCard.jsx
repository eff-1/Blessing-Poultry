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
      ? ` - Only ${product.stock_quantity || 'few'} left in stock` 
      : product.stock_status === 'in_stock' 
      ? ' - Available in stock' 
      : ' - Currently out of stock'
    
    const productUrl = `https://blessing-poultry.vercel.app/#products?search=${encodeURIComponent(product.name)}`
    
    const message = encodeURIComponent(
      `BLESSING POULTRIES - ORDER INQUIRY\n\n` +
      `Product: ${product.name}\n` +
      `Price: ${formatPrice(product.price)}\n` +
      `Category: ${product.category}${stockInfo}\n` +
      `Description: ${product.description || 'Premium quality product'}\n\n` +
      `View This Product: ${productUrl}\n\n` +
      `Hello, I am interested in ordering this product. Please provide information about availability, delivery options, and payment methods.\n\n` +
      `Thank you for your time.`
    )
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank')
  }

  const handleImageClick = () => {
    // Check if product is out of stock
    if (product.stock_status === 'out_of_stock' || !product.in_stock) {
      // Show popup message for out of stock
      alert(`Sorry, "${product.name}" is currently out of stock. Please check back later or contact us for availability updates.`)
      return
    }

    const stockInfo = product.stock_status === 'few_left' 
      ? ` - Only ${product.stock_quantity || 'few'} left in stock` 
      : product.stock_status === 'in_stock' 
      ? ' - Available in stock' 
      : ' - Currently out of stock'
    
    const productUrl = `https://blessing-poultry.vercel.app/#products?search=${encodeURIComponent(product.name)}`
    
    const message = encodeURIComponent(
      `BLESSING POULTRIES - PRODUCT INQUIRY\n\n` +
      `Product: ${product.name}\n` +
      `Price: ${formatPrice(product.price)}\n` +
      `Category: ${product.category}${stockInfo}\n` +
      `Description: ${product.description || 'Premium quality product'}\n\n` +
      `Product Image: ${product.image_url}\n\n` +
      `View This Product: ${productUrl}\n\n` +
      `Hello, I am interested in this specific product. Please provide more details about availability, delivery options, and payment methods.\n\n` +
      `Thank you for your time.`
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
      <div className="product-image-wrapper relative group">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="product-image cursor-pointer hover:opacity-90 transition-opacity" 
          onClick={handleImageClick}
          title="Click to inquire about this product via WhatsApp"
        />
        
        {/* WhatsApp Click Indicator */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-green-600 text-white px-3 py-2 rounded-full flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform">
            <FaWhatsapp size={16} />
            <span className="text-sm font-medium">View on WhatsApp</span>
          </div>
        </div>
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

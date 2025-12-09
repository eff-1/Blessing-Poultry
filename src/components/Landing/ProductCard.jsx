import { motion } from 'framer-motion'
import { formatPrice } from '../../lib/utils'

export const ProductCard = ({ product }) => {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      style={{ position: 'relative' }}
    >
      <img src={product.image_url} alt={product.name} className="product-image" />
      <span className={`product-badge ${product.in_stock ? 'badge-in-stock' : 'badge-out-stock'}`}>
        {product.in_stock ? 'In Stock' : 'Out of Stock'}
      </span>
      <div style={{ padding: '20px' }}>
        <h4 style={{ marginBottom: '8px' }}>{product.name}</h4>
        <p style={{ color: '#666', marginBottom: '16px' }}>{product.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-green)' }}>
            {formatPrice(product.price)}
          </span>
          <span style={{ fontSize: '14px', color: '#999' }}>{product.category}</span>
        </div>
      </div>
    </motion.div>
  )
}

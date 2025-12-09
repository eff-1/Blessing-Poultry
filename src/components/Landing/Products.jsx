import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '../Shared/LoadingSpinner'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('All Products')
  const [loading, setLoading] = useState(true)

  const categories = ['All Products', 'Eggs', 'Broilers', 'Layers', 'Day-Old Chicks', 'Feeds']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const filteredProducts = filter === 'All Products'
    ? products
    : products.filter(p => p.category === filter)

  return (
    <section id="products" className="section-padding" style={{ backgroundColor: 'white' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 className="section-title">Our Products</h2>
          <p className="section-subtitle">Fresh and quality poultry products</p>
        </motion.div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: filter === cat ? 'var(--primary-green)' : '#f0f0f0',
                color: filter === cat ? 'white' : 'var(--text-dark)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Row>
            {filteredProducts.map((product, index) => (
              <Col key={product.id} lg={4} md={6} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  )
}

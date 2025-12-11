import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '../Shared/LoadingSpinner'
import { FiSearch } from 'react-icons/fi'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('All Products')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = ['All Products', 'Eggs', 'Broilers', 'Layers', 'Day-Old Chicks', 'Feeds']

  useEffect(() => {
    fetchProducts()
    
    // Listen for search events from navbar
    const handleSearch = (e) => {
      setSearchQuery(e.detail)
    }
    window.addEventListener('searchProducts', handleSearch)
    return () => window.removeEventListener('searchProducts', handleSearch)
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All Products' || p.category === filter
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section id="products" className="products-section-new">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="products-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="products-badge">Our Products</span>
          <h2 className="products-title">Fresh & Quality Poultry Products</h2>
          <p className="products-subtitle">
            Premium quality products delivered straight from our farm to your table
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="products-search"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <FiSearch size={20} />
          <input
            type="text"
            placeholder="Search for eggs, chicken, feeds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        {/* Category Filters */}
        <div className="products-filters">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFilter(cat)
                setSearchQuery('') // Clear search when filter is clicked
              }}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="no-products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>No products found matching your search.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

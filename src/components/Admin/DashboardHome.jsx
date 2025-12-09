import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Row, Col } from 'react-bootstrap'
import { supabase } from '../../lib/supabaseClient'
import { FaBox, FaImage, FaStar } from 'react-icons/fa'

export const DashboardHome = () => {
  const [stats, setStats] = useState({ products: 0, gallery: 0, testimonials: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [products, gallery, testimonials] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    ])

    setStats({
      products: products.count || 0,
      gallery: gallery.count || 0,
      testimonials: testimonials.count || 0,
    })
  }

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: FaBox, color: '#2E7D32' },
    { label: 'Gallery Images', value: stats.gallery, icon: FaImage, color: '#2196F3' },
    { label: 'Testimonials', value: stats.testimonials, icon: FaStar, color: '#FFC107' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Dashboard Overview</h2>
      <Row>
        {statCards.map((stat, index) => (
          <Col key={index} lg={4} md={6} className="mb-4">
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <stat.icon size={48} color={stat.color} />
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

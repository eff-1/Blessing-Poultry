import { motion } from 'framer-motion'
import { Container, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export const About = () => {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    const { data } = await supabase.from('about').select('*').single()
    setAbout(data)
  }

  return (
    <section id="about" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">About Us</h2>
              <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
                {about?.content || 'At Blessing Poultry, we are dedicated to providing fresh, healthy, and naturally raised poultry products. Our farm has been serving the community for years with quality products and exceptional service.'}
              </p>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src={about?.image_url || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800'}
                alt="About Blessing Poultry"
                style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', width: '100%' }}
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Award, Heart, Leaf, TrendingUp } from 'lucide-react'

export const About = () => {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    const { data } = await supabase.from('about').select('*').single()
    setAbout(data)
  }

  const features = [
    {
      icon: <Leaf size={32} />,
      title: 'Natural & Healthy',
      description: 'Raised with care using natural farming practices'
    },
    {
      icon: <Award size={32} />,
      title: 'Premium Quality',
      description: 'Only the best products for our customers'
    },
    {
      icon: <Heart size={32} />,
      title: 'Ethical Treatment',
      description: 'Humane care for all our birds'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Years of Experience',
      description: 'Trusted by the community for quality'
    }
  ]

  const stats = [
    { number: '10+', label: 'Years Experience' },
    { number: '5000+', label: 'Happy Customers' },
    { number: '100%', label: 'Fresh Products' },
    { number: '24/7', label: 'Support' }
  ]

  return (
    <section id="about" className="about-section-new">
      {/* Decorative Background */}
      <div className="about-bg-pattern"></div>
      
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-badge">About Us</span>
          <h2 className="about-title">
            We Are Into Poultry Production & Treatment of All Kinds of Birds
          </h2>
          <div className="about-title-underline"></div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="about-grid">
          {/* Left Side - Images */}
          <motion.div
            className="about-images"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-image-main">
              <img
                src={about?.image_url || '/images/about/farm-1.jpg'}
                alt="Blessing Poultries Farm"
              />
              <div className="about-image-badge">
                <span className="badge-number">10+</span>
                <span className="badge-text">Years of Excellence</span>
              </div>
            </div>
            <div className="about-image-grid">
              <img src="/images/about/farm-2.jpg" alt="Our Facilities" />
              <img src="/images/about/farm-3.jpg" alt="Quality Birds" />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="about-text">
              {about?.content || 'At Blessing Poultries, we are dedicated to providing fresh, healthy, and naturally raised poultry products. Our farm has been serving the community for years with quality products and exceptional service. We believe in sustainable farming practices and the humane treatment of our birds.'}
            </p>

            <p className="about-text-secondary">
              Located at 141, Idiroko Express Way, Oju-Ore, Ota, we pride ourselves on delivering premium quality poultry products straight from our farm to your table. Every bird is raised with care, ensuring you get the freshest and healthiest products.
            </p>

            {/* Feature Cards */}
            <div className="about-features">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              className="about-cta-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="about-stats"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

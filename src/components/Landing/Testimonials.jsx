import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data || [])
  }

  const next = () => setCurrent((current + 1) % testimonials.length)
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)

  if (testimonials.length === 0) return null

  const testimonial = testimonials[current]

  return (
    <section id="testimonials" className="section-padding" style={{ backgroundColor: 'white' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real feedback from real customers</p>
        </motion.div>

        <div className="testimonials-wrapper">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="testimonial-card"
          >
            {testimonial.image_url && (
              <img src={testimonial.image_url} alt={testimonial.name} className="testimonial-avatar" />
            )}
            <h4>{testimonial.name}</h4>
            <div className="star-rating">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="testimonial-text">
              "{testimonial.comment}"
            </p>
          </motion.div>

          {testimonials.length > 1 && (
            <div className="testimonial-nav">
              <button onClick={prev} className="testimonial-nav-btn testimonial-prev">
                <FaChevronLeft />
              </button>
              <button onClick={next} className="testimonial-nav-btn testimonial-next">
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import { supabase } from '../../lib/supabaseClient'

export const Contact = () => {
  const [contact, setContact] = useState(null)

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    const { data } = await supabase.from('contact_info').select('*').single()
    setContact(data)
  }

  const contactItems = [
    { icon: FaPhone, label: 'Phone', value: contact?.phone, href: `tel:${contact?.phone}` },
    { icon: FaWhatsapp, label: 'WhatsApp', value: contact?.whatsapp, href: `https://wa.me/${contact?.whatsapp}` },
    { icon: FaEnvelope, label: 'Email', value: contact?.email, href: `mailto:${contact?.email}` },
    { icon: FaMapMarkerAlt, label: 'Address', value: contact?.address },
  ]

  const socials = [
    { icon: FaFacebook, url: contact?.facebook },
    { icon: FaInstagram, url: contact?.instagram },
    { icon: FaTwitter, url: contact?.twitter },
  ]

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">We'd love to hear from you</p>
        </motion.div>

        <Row>
          <Col lg={6}>
            {contactItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <item.icon size={32} color="var(--primary-green)" />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>
                      {item.value}
                    </a>
                  ) : (
                    <div>{item.value}</div>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', gap: '16px', marginTop: '32px' }}
            >
              {socials.map((social, index) => (
                social.url && (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -4 }}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-green)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <social.icon size={24} />
                  </motion.a>
                )
              ))}
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ height: '100%', minHeight: '400px', borderRadius: '12px', overflow: 'hidden' }}
            >
              <img
                src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800"
                alt="Contact"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

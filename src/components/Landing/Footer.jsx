import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { GiChicken } from 'react-icons/gi'
import { supabase } from '../../lib/supabaseClient'

export const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: 'Loading...',
    email: 'Loading...',
    address: 'Loading...'
  })

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      // Get contact info from database
      const { data: contact } = await supabase
        .from('contact_info')
        .select('*')
        .single()

      if (contact) {
        setContactInfo({
          phone: contact.phone || '+234 XXX XXX XXXX',
          email: contact.email || 'info@blessingpoultry.com',
          address: contact.address || 'Lagos, Nigeria'
        })
      } else {
        // Fallback to default values
        setContactInfo({
          phone: '+234 XXX XXX XXXX',
          email: 'info@blessingpoultry.com',
          address: 'Lagos, Nigeria'
        })
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      // Use fallback values
      setContactInfo({
        phone: '+234 XXX XXX XXXX',
        email: 'info@blessingpoultry.com',
        address: 'Lagos, Nigeria'
      })
    }
  }

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={4} className="mb-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <GiChicken size={32} />
              <h4>Blessing Poultry</h4>
            </div>
            <p>Fresh, healthy, and naturally raised poultry products from our farm to your table.</p>
          </Col>
          <Col lg={4} className="mb-4">
            <h5 style={{ marginBottom: '16px' }}>Quick Links</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Home', 'About', 'Products', 'Gallery', 'Testimonials', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </Col>
          <Col lg={4} className="mb-4">
            <h5 style={{ marginBottom: '16px' }}>Contact</h5>
            <p>Phone: {contactInfo.phone}</p>
            <p>Email: {contactInfo.email}</p>
            <p>Address: {contactInfo.address}</p>
          </Col>
        </Row>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px', textAlign: 'center' }}>
          <p>&copy; {new Date().getFullYear()} Blessing Poultry. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}

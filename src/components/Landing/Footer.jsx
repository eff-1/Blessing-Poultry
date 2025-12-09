import { Container, Row, Col } from 'react-bootstrap'
import { GiChicken } from 'react-icons/gi'

export const Footer = () => {
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
            <p>Phone: [Your Phone]</p>
            <p>Email: [Your Email]</p>
            <p>Address: [Your Address]</p>
          </Col>
        </Row>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px', textAlign: 'center' }}>
          <p>&copy; {new Date().getFullYear()} Blessing Poultry. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}

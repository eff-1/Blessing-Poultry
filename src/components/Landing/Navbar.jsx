import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { GiChicken } from 'react-icons/gi'

export const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Navbar expand="lg" fixed="top" className={`navbar-custom ${scrolled ? 'scrolled' : ''}`} style={{ backgroundColor: scrolled ? 'white' : 'transparent' }}>
      <Container>
        <Navbar.Brand style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '24px', color: 'var(--primary-green)' }}>
          <GiChicken size={32} />
          Blessing Poultry
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            {['home', 'about', 'products', 'gallery', 'testimonials', 'contact'].map((item) => (
              <Nav.Link key={item} onClick={() => scrollToSection(item)} style={{ cursor: 'pointer' }}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

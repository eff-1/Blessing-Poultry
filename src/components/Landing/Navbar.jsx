import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiChicken } from 'react-icons/gi'
import { FiMenu, FiX, FiSearch } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'

export const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Set scrolled state
      setScrolled(currentScrollY > 50)
      
      // Simple and reliable scroll detection for mobile
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setHidden(true)
        console.log('Hiding navbar - scrolling down')
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - always show
        setHidden(false)
        console.log('Showing navbar - scrolling up')
      }
      
      setLastScrollY(currentScrollY)
    }
    
    // Use both scroll and touchmove for better mobile detection
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })
    
    fetchProducts()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [lastScrollY])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setAllProducts(data || [])
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, allProducts])

  // Focus search input when search opens and disable scroll
  useEffect(() => {
    if (searchOpen) {
      // Disable page scrolling
      document.body.style.overflow = 'hidden'
      
      // Focus the input
      setTimeout(() => {
        const searchInput = document.querySelector('.search-form-new input')
        if (searchInput) {
          searchInput.focus()
        }
      }, 100)
    } else {
      // Re-enable page scrolling when search closes
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to ensure scroll is re-enabled
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [searchOpen])

  const scrollToSection = (id) => {
    if (id === 'products') {
      // Scroll to products section top for better visibility
      const productsSection = document.getElementById('products')
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const handleSearchSelect = (product) => {
    // Clear any existing search first
    window.dispatchEvent(new CustomEvent('searchProducts', { detail: '' }))
    // Then set the new search
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('searchProducts', { detail: product.name }))
      scrollToSection('products')
    }, 100)
    setSearchQuery('')
    setSearchOpen(false)
    setSearchResults([])
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Clear any existing search first
      window.dispatchEvent(new CustomEvent('searchProducts', { detail: '' }))
      // Then set the new search
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('searchProducts', { detail: searchQuery }))
        scrollToSection('products')
      }, 100)
      setSearchQuery('')
      setSearchOpen(false)
      setSearchResults([])
    }
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'products', label: 'Products' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <>
      {/* Organic Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`navbar-organic ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}
      >
        <div className="navbar-blob">
          <svg className="blob-shape" viewBox="0 0 1440 180" preserveAspectRatio="none">
            <path
              d="M0,90 Q360,30 720,90 T1440,90 L1440,0 L0,0 Z"
              fill={scrolled ? '#ffffff' : 'rgba(255, 255, 255, 0.98)'}
            />
          </svg>
        </div>

        <div className="navbar-content">
          {/* Logo */}
          <motion.div
            className="navbar-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('home')}
          >
            <div className="logo-circle">
              <GiChicken size={24} />
            </div>
            <span className="logo-text">Blessing Poultries</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="navbar-links">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="nav-link"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Search & Mobile Menu */}
          <div className="navbar-actions">
            <motion.button
              className="search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiSearch size={18} />
            </motion.button>



            <motion.button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Smart Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay-new"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="search-blob-bg">
              <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
                <path
                  d="M0,100 Q360,40 720,100 T1440,100 L1440,0 L0,0 Z"
                  fill="rgba(255, 255, 255, 0.98)"
                />
              </svg>
            </div>
            
            <div className="search-container-new">
              <form onSubmit={handleSearch} className="search-form-new">
                <FiSearch size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search eggs, chicken, feeds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="search-close">
                  <FiX size={20} />
                </button>
              </form>

              {/* Search Suggestions */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    className="search-suggestions"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {searchResults.map((product, index) => (
                      <motion.div
                        key={product.id}
                        className="suggestion-item"
                        onClick={() => handleSearchSelect(product)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: '#f5f5f5' }}
                      >
                        <img src={product.image_url} alt={product.name} />
                        <div className="suggestion-info">
                          <div className="suggestion-name">
                            {product.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                              part.toLowerCase() === searchQuery.toLowerCase() ? (
                                <span key={i} className="highlight">{part}</span>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </div>
                          <div className="suggestion-meta">
                            <span className="suggestion-category">{product.category}</span>
                            <span className="suggestion-price">₦{product.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
                <FiX size={28} />
              </button>
              
              <div className="mobile-menu-content">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="mobile-nav-link"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

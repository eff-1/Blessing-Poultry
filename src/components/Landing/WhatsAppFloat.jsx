import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'

export const WhatsAppFloat = () => {
  const [whatsapp, setWhatsapp] = useState('')
  const [position, setPosition] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const buttonRef = useRef(null)

  useEffect(() => {
    fetchWhatsApp()
    
    // Load saved position from localStorage
    const savedPosition = localStorage.getItem('whatsappButtonPosition')
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition))
    }
  }, [])

  const fetchWhatsApp = async () => {
    const { data } = await supabase.from('contact_info').select('whatsapp').single()
    setWhatsapp(data?.whatsapp || '2348012345678')
  }

  const handleClick = (e) => {
    if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }

  const handleDragStart = (e) => {
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
    
    const rect = buttonRef.current.getBoundingClientRect()
    setDragStart({ 
      x: clientX - rect.left, 
      y: clientY - rect.top 
    })
    setIsDragging(false)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
    
    setIsDragging(true)
    
    // Calculate new position
    const newX = clientX - dragStart.x
    const newY = clientY - dragStart.y
    
    // Constrain to viewport with padding
    const buttonSize = 60
    const padding = 10
    const maxX = window.innerWidth - buttonSize - padding
    const maxY = window.innerHeight - buttonSize - padding
    
    setPosition({
      x: Math.max(padding, Math.min(newX, maxX)),
      y: Math.max(padding, Math.min(newY, maxY))
    })
  }

  const handleDragEnd = () => {
    // Save position to localStorage
    if (isDragging && position) {
      localStorage.setItem('whatsappButtonPosition', JSON.stringify(position))
    }
    
    // Reset dragging state after a short delay to prevent click
    setTimeout(() => setIsDragging(false), 150)
  }

  if (!whatsapp) return null

  const buttonStyle = position ? {
    left: `${position.x}px`,
    top: `${position.y}px`,
    right: 'auto',
    bottom: 'auto'
  } : {
    right: '20px',
    bottom: '20px'
  }

  return (
    <motion.a
      ref={buttonRef}
      href={isDragging ? undefined : `https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-draggable"
      onClick={handleClick}
      onMouseDown={handleDragStart}
      onMouseMove={isDragging ? handleDrag : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDrag}
      onTouchEnd={handleDragEnd}
      style={{
        ...buttonStyle,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      whileHover={!isDragging ? { scale: 1.1 } : {}}
      whileTap={!isDragging ? { scale: 0.9 } : {}}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="whatsapp-pulse"></div>
      <FaWhatsapp />
      {!isDragging && <div className="whatsapp-tooltip">Drag me!</div>}
    </motion.a>
  )
}

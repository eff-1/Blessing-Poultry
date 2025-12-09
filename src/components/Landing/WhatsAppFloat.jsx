import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export const WhatsAppFloat = () => {
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    fetchWhatsApp()
  }, [])

  const fetchWhatsApp = async () => {
    const { data } = await supabase.from('contact_info').select('whatsapp').single()
    setWhatsapp(data?.whatsapp || '')
  }

  if (!whatsapp) return null

  return (
    <motion.a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1 }}
    >
      <FaWhatsapp />
    </motion.a>
  )
}

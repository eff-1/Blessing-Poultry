import { motion } from 'framer-motion'
import { GiChicken } from 'react-icons/gi'
import { MdDashboard, MdImage, MdRateReview, MdContactMail, MdLogout } from 'react-icons/md'
import { FaBox, FaInfoCircle } from 'react-icons/fa'

export const Sidebar = ({ currentPage, setCurrentPage, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'gallery', label: 'Gallery', icon: MdImage },
    { id: 'testimonials', label: 'Testimonials', icon: MdRateReview },
    { id: 'about', label: 'About', icon: FaInfoCircle },
    { id: 'contact', label: 'Contact Info', icon: MdContactMail },
  ]

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <GiChicken size={32} /> Blessing Poultry
      </div>
      <ul className="admin-nav">
        {menuItems.map((item) => (
          <motion.li
            key={item.id}
            className={`admin-nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
            whileHover={{ x: 4 }}
          >
            <item.icon size={20} />
            {item.label}
          </motion.li>
        ))}
        <motion.li
          className="admin-nav-item logout"
          onClick={onLogout}
          whileHover={{ x: 4 }}
          style={{ marginTop: '40px' }}
        >
          <MdLogout size={20} />
          Logout
        </motion.li>
      </ul>
    </div>
  )
}

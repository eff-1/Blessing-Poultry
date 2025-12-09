import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sidebar } from '../components/Admin/Sidebar'
import { DashboardHome } from '../components/Admin/DashboardHome'
import { ManageProducts } from '../components/Admin/ManageProducts'
import { ManageGallery } from '../components/Admin/ManageGallery'
import { ManageTestimonials } from '../components/Admin/ManageTestimonials'
import { ManageAbout } from '../components/Admin/ManageAbout'
import { ManageContact } from '../components/Admin/ManageContact'
import { LoadingSpinner } from '../components/Shared/LoadingSpinner'

export const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut()
      navigate('/admin/login')
    }
  }

  if (loading) return <LoadingSpinner />

  if (!user) {
    navigate('/admin/login')
    return null
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />
      case 'products':
        return <ManageProducts />
      case 'gallery':
        return <ManageGallery />
      case 'testimonials':
        return <ManageTestimonials />
      case 'about':
        return <ManageAbout />
      case 'contact':
        return <ManageContact />
      default:
        return <DashboardHome />
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} />
      <div className="admin-main">
        <div className="admin-topbar">
          <h3>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h3>
          <div>Welcome, Admin</div>
        </div>
        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  )
}

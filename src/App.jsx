import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { EmailVerified } from './pages/EmailVerified'
import { EmailSent } from './pages/EmailSent'
import { EmailConfirm } from './pages/EmailConfirm'
import { VerifyOTP } from './pages/VerifyOTP'
import { Admin } from './pages/Admin'
import { NotificationProvider } from './components/Shared/NotificationSystem'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/global.css'
import './styles/mobile-fix.css'
import './styles/landing.css'
import './styles/admin.css'

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/auth/email-sent" element={<EmailSent />} />
          <Route path="/auth/confirm" element={<EmailConfirm />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </NotificationProvider>
  )
}

export default App

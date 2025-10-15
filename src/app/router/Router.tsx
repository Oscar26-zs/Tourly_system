import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../providers/AuthProvider'
import TouristRegister from '../../features/public/pages/RegisterTourist'
import GuideRegister from '../../features/guide/pages/RegisterGuide'
import GuideOnly from '../../features/guide/pages/GuideOnly'
import Login from '../../features/public/pages/login'
import Home from '../../features/public/pages/Home'
import ForgotPassword from '../../features/public/pages/ForgotPassword'
import PasswordResetSent from '../../features/public/pages/PasswordResetSent'
import ResetPassword from '../../features/public/pages/ResetPassword'
import { TourDetailPage } from '../../features/public/pages/TourDetail'
import BookingForm from '../../features/public/pages/BookingForm'
import UserSettings from '../../shared/pages/UserSettings'


const Router = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/registerTourist" element={<TouristRegister />} />
        <Route path="/registerGuide" element={<GuideRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-sent" element={<PasswordResetSent />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/tour/:tourId" element={<TourDetailPage />} />
        <Route path="/guide-only" element={<GuideOnly />} />
        <Route path="/user-settings" element={<UserSettings />} />
        <Route path="/BookingForm" element={<BookingForm />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default Router
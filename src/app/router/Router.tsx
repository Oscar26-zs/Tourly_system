import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../providers/AuthProvider'
import TouristRegister from '../../features/public/pages/RegisterTourist'
import GuideRegister from '../../features/public/pages/RegisterGuide'
import GuideOnly from '../../features/public/components/GuideOnly'
import Login from '../../features/public/pages/login'
import Home from '../../features/public/pages/Home'

const Router = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/registerTourist" element={<TouristRegister />} />
        <Route path="/registerGuide" element={<GuideRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/guide-only" element={<GuideOnly />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default Router
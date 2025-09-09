import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TouristRegister from '../../features/public/pages/RegisterTourist'
import GuideRegister from '../../features/public/pages/RegisterGuide'
import Login from '../../features/public/pages/Login'
import Home from '../../features/public/components/home'
import GuideOnly from '../../features/public/components/GuideOnly'

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/registerTourist" element={<TouristRegister />} />
      <Route path="/registerGuide" element={<GuideRegister />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/guide-only" element={<GuideOnly />} />
      <Route path="/" element={<div>Página principal</div>} />
    </Routes>
  </BrowserRouter>
)

export default Router
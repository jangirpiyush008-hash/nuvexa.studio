import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import NovaBot from '@/components/NovaBot'
import Cursor from '@/components/Cursor'
import RocketTrail from '@/components/RocketTrail'
import LoadingScreen from '@/components/LoadingScreen'
import { GlobalFX } from '@/components/fx'
import Home from '@/pages/Home'
import ServicesPage from '@/pages/ServicesPage'
import ProjectsPage from '@/pages/ProjectsPage'
import AcademyPage from '@/pages/AcademyPage'
import AboutPage from '@/pages/AboutPage'
import OurTeamPage from '@/pages/OurTeamPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const isHome = location.pathname === '/'

  return (
    <div style={{ backgroundColor: '#0C0C0C', minHeight: '100vh', overflowX: 'clip', position: 'relative' }}>
      <GlobalFX />
      <Cursor />
      <RocketTrail />
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-out' }}>
        {/* Navbar is rendered inside HeroSection on home; on every other route show shared Navbar */}
        {!isHome && <Navbar />}

        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/our-team" element={<OurTeamPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <NovaBot />
      </div>
    </div>
  )
}

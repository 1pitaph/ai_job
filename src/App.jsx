import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './landing/components/layout/Navbar'
import Footer from './landing/components/layout/Footer'
import HeroSection from './landing/components/sections/HeroSection'
import AboutSection from './landing/components/sections/AboutSection'
import CanvasPage from './canvas/pages/CanvasPage'
import AuthModal from './auth/components/AuthModal'
import { AuthProvider, useAuth } from './auth/AuthContext'

function HomePage() {
  const [authTab, setAuthTab] = useState(null)

  return (
    <>
      <Navbar
        onLogin={() => setAuthTab('login')}
        onGetStarted={() => setAuthTab('signup')}
      />
      <main>
        <HeroSection />
        <AboutSection />
      </main>
      <Footer />
      {authTab && <AuthModal defaultTab={authTab} onClose={() => setAuthTab(null)} />}
    </>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas" element={
          <ProtectedRoute>
            <CanvasPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App

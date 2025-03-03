import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Canvas from './pages/Canvas'
import Auth from './pages/Auth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />
    }
    return <>{children}</>
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/canvas" element={
              <ProtectedRoute>
                <Canvas />
              </ProtectedRoute>
            } />
            <Route path="/auth" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
            
            {/* Redirect old routes to the new auth page */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'

// Pages
import HomePage from './pages/Home/HomePage'
import CoursePage from './pages/Course/CoursePage'
import AdminPage from './pages/Admin/AdminPage'
import LoginPage from './pages/Auth/LoginPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

// Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ErrorLogger from './modules/ErrorLogger/ErrorLogger'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ErrorLogger />
      <Header user={user} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/admin" element={
            user?.email ? <AdminPage /> : <Navigate to="/login" />
          } />
          <Route path="/login" element={
            user?.email ? <Navigate to="/admin" /> : <LoginPage />
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App 
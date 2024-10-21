import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import WorkoutTracker from './components/WorkoutTracker'
import CalorieTracker from './components/CalorieTracker'
import WorkoutGuide from './components/WorkoutGuide'
import Navbar from './components/Navbar'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/workout"
            element={user ? <WorkoutTracker /> : <Navigate to="/login" />}
          />
          <Route
            path="/calories"
            element={user ? <CalorieTracker /> : <Navigate to="/login" />}
          />
          <Route
            path="/guide"
            element={user ? <WorkoutGuide /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>

  )
}

export default App
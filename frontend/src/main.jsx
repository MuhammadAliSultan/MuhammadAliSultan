import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Welcome from './components/Welcome.jsx'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import  Interface from './components/Interface.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'
// import { useAuth } from "./context/useAuth.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AuthProvider> */}
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Interface />} /> 
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
    {/* </AuthProvider> */}
  </StrictMode>,
)

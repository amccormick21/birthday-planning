import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './firebase/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Location from './pages/Location'
import Accommodation from './pages/Accommodation'
import Walks from './pages/Walks'
import Login from './pages/Login'
import UploadWalk from './pages/UploadWalk'
import './styles/App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Location />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/walks" 
            element={
              <ProtectedRoute>
                <Walks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload-walk" 
            element={
              <ProtectedRoute>
                <UploadWalk />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App

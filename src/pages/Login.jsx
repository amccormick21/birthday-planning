import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
import '../styles/Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    try {
      setError('')
      setLoading(true)
      await signIn(email, password)
      navigate('/walks')
    } catch (error) {
      console.error('Login error:', error)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password')
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError('Failed to sign in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Sign In</h1>
          <p>Log in to access walks and upload routes</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-info">
          <p>
            <strong>Note:</strong> User accounts are created by administrators only.
            Contact an admin to request access.
          </p>
        </div>
      </div>
    </div>
  )
}

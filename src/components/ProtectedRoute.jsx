import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, isAdmin } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/walks" replace />
  }

  return children
}

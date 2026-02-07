import { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './config'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setUserProfile(userDoc.data())
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUserProfile(null)
  }

  const isAdmin = () => {
    return userProfile?.isAdmin === true
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    signIn,
    signOut,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

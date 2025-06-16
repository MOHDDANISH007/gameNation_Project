'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])
 
  // ✅ LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/authentication/login',
        {
          userEmail: email,
          userPassword: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // ✅ send cookies with request
        }
      )

      const userData = res.data
      console.log('userData', userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      router.push('/') // redirect to home or dashboard
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message)
      alert(err.response?.data || 'Login error')
    }
  }

  // ✅ SIGNUP FUNCTION
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/authentication/signup',
        {
          userName: name,
          userEmail: email,
          userPassword: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // ✅ send cookies with request
        }
      )

      const userData = res.data
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      router.push('/')
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message)
      alert(err.response?.data || 'Signup error')
    }
  }

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
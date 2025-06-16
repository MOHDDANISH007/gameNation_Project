'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// ✅ Now exported properly
export const UserInformationContext = createContext()

export const UserInformationProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include'
        })
        console.log('res from navbar', res)
        if (res.ok) {
          const data = await res.json()
          setLoggedIn(data.authenticated)
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        setLoggedIn(false)
      }
    }

    checkLoggedIn()
  }, [])

  useEffect(() => {
    const userInformation = async () => {
      try {
        const res = await fetch('http://localhost:5000/userInformation/user-info', {
          method: 'GET',
          credentials: 'include'
        })
        console.log('User info from navbar', res)
        if (res.ok) {
          const data = await res.json()
          setUserInfo(data.userInfo)
        }
      } catch (err) {
        console.error('Error fetching user info:', err)
        setUserInfo({})
      }
    }

    userInformation()
  }, [])

  return (
    <UserInformationContext.Provider value={{ loggedIn, userInfo }}>
      {children}
    </UserInformationContext.Provider>
  )
}

// ✅ Custom hook for easy usage
export const useUserInformation = () => useContext(UserInformationContext)

export default UserInformationProvider

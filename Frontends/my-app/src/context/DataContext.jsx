'use client'

import { createContext, useContext, useState } from 'react'
import axios from 'axios'

// Create a proper context
const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const BASE_URL = 'https://gamenation-project-backend.onrender.com'

  const dataFromBackendForPS4 = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ps4`)
      return res.data
    } catch (error) {
      console.error('Error fetching ps4 data:', error)
      return null
    }
  }

  const dataFromBackendForPS5 = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/ps5`)
      return res.data
    } catch (error) {
      console.error('Error fetching ps5 data:', error)
      return null
    }
  }

  const dataFromBackendForXbox_One = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/xboxOne`)
      return res.data
    } catch (error) {
      console.error('Error fetching xbox one data:', error)
      return null
    }
  }

  const dataFromBackendForXbox_X = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/xboxX`)
      return res.data
    } catch (error) {
      console.error('Error fetching xbox x data:', error)
      return null
    }
  }

  const dataFromBackendForConsoles = async () =>{
    try{
      const res = await axios.get(`${BASE_URL}/products`)
      return res.data
    }
    catch(error){
      console.error("Error fetching console data:", error)
      return null
    }
  }

  return (
    <DataContext.Provider value={{ dataFromBackendForConsoles, dataFromBackendForXbox_X, dataFromBackendForXbox_One, dataFromBackendForPS4, dataFromBackendForPS5, loading, setLoading }}>
      {children}
    </DataContext.Provider>
  )
}

// Custom hook to access the context
export const useData = () => useContext(DataContext)

export default DataContext

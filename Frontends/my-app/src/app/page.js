'use client'
import './globals.css'
import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { NextResponse } from 'next/server'



export default function Home () {
  const { dataFromBackendForXbox_X, loading } = useData()
  const { login } = useAuth()
  const [games, setGames] = useState([])
  const searchParams = useSearchParams()
  const query = searchParams.get('query')?.trim().toLowerCase()
  const [cookie, setCookie] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  console.log('Data from Home is :', games)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dataFromBackendForXbox_X()
        console.log('Games ', res.xboxXs)
        if (Array.isArray(res.xboxXs)) {
          setGames(res.xboxXs)
        } else {
          console.warn('Unexpected data format', res)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])
  console.log(NextResponse)

  useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          console.log('Data from auth is :', data)
          setCookie(data.authenticated)
          // Show popup after checking auth status
          if (!data.authenticated) {
            setTimeout(() => setShowLoginPopup(true), 2000) // Show after 2 seconds
          }
        } else {
          setCookie(false)
          setTimeout(() => setShowLoginPopup(true), 2000)
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        setCookie(false)
        setTimeout(() => setShowLoginPopup(true), 2000)
      }
    }

    checkCookie()
  }, [])

  const handleSubmit = async e => {
    setIsLoading(true)
    try {
      await login(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupClick = () => {
    router.push('/signup')
  }

  const filterData = games.filter(game => {
    const name = game?.game_name?.toLowerCase().replace(/\s+/g, '')
    const search = query?.replace(/\s+/g, '')
    return name && search && name.includes(search)
  })

  const displayGames = query ? filterData : games

  // if (loading) {
  //   return <p className='text-white text-center text-xl'>Loading...</p>
  // }

  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className='text-white px-4 py-6'>
          <h1 className='text-3xl underline p-2 font-bold mb-4'>
            Xbox Series X Games
          </h1>

          <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {displayGames.map(game => (
              <li
                key={game.game_id}
                className='bg-gray-800 p-4 rounded shadow cursor-pointer hover:bg-gray-700 transition'
              >
                <Link href={`/games/xboxX/${game.game_id}`}>
                  <img
                    src={game.image_link || '/fallback.jpg'}
                    alt={game.game_name || 'Game Image'}
                    width={300}
                    height={200}
                    className='w-full h-48 object-cover rounded mb-3'
                  />
                  <h2 className='text-lg font-semibold mb-2 line-clamp-2'>
                    {game.game_name}
                  </h2>
                  <p className='text-yellow-400 font-bold text-xl'>
                    ₹{game.price_inr}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {query && filterData.length === 0 && (
            <p className='text-white text-xl font-semibold text-center mt-6'>
              No game found by this name.
            </p>
          )}
        </div>
      </motion.div>

      {/* Login Popup */}
      <AnimatePresence>
        {showLoginPopup && !cookie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            onClick={() => setShowLoginPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-6 sm:p-8 w-full max-w-md relative'
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowLoginPopup(false)}
                className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

              {/* Header */}
              <div className='text-center mb-6'>
                <h2 className='text-2xl font-bold text-white mb-2'>
                  Welcome Back!
                </h2>
                <p className='text-gray-400'>
                  Sign in to access exclusive features
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Email field */}
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                    <svg
                      className='w-5 h-5 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                      />
                    </svg>
                  </div>
                  <input
                    type='email'
                    placeholder='Email address'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                    required
                  />
                </div>

                {/* Password field */}
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                    <svg
                      className='w-5 h-5 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPassword ? (
                      <svg
                        className='w-5 h-5 text-gray-400 hover:text-white transition-colors'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3-3l6.364 6.364M21 21l-6.364-6.364m0 0L12 12m-3-3L3 3'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='w-5 h-5 text-gray-400 hover:text-white transition-colors'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Login button */}
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  {isLoading ? (
                    <div className='flex items-center justify-center'>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className='text-center mt-6'>
                <p className='text-gray-400 text-sm'>
                  Don't have an account?{' '}
                  <Link
                    href='/signup'
                    className='text-purple-400 hover:text-purple-300 transition-colors'
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>




    </>
  )
}

'use client'

import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MdAccountCircle, MdKeyboardArrowDown } from 'react-icons/md'
import { FaSearch } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BsCart4 } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserInformationContext } from '../context/UserInformation' // ✅ ADDED THIS LINE

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileGamesOpen, setIsMobileGamesOpen] = useState(false)
  const [isDesktopGamesOpen, setIsDesktopGamesOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchContent, setSearchContent] = useState('')
  const [userName, setUserName] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { userInfo, loggedIn } = useContext(UserInformationContext)

  useEffect(() => {
    if (userInfo && userInfo.userName) {
      const username = userInfo.userName.split(' ')[0]
      setUserName(username)
      setFullName(userInfo.userName)
    }
  }, [userInfo])

  useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include'
        })

        if (!res.ok) {
          setUserName('')
          setFullName('')
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        setUserName('')
        setFullName('')
      }
    }

    checkCookie()
  }, [])

  console.log('From NavBar user info', userInfo)
  console.log('Logged in', loggedIn)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsMobileGamesOpen(false)
  }

  const handleCartClick = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'GET',
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        if (data.authenticated) {
          router.push('/cartt')
        } else {
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }

  const handleSearch = () => {
    if (searchContent.trim()) {
      router.push(`?query=${encodeURIComponent(searchContent)}`, {
        scroll: false
      })
      setSearchOpen(false)
      setSearchContent('')
    }
  }

  const clearSearch = () => {
    router.replace('', { scroll: false }) // removes ?query
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500'></div>
        <p className='ml-4 text-lg text-gray-700 font-medium'>Loading...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='relative'
    >
      {/* Desktop Navigation */}
      <nav className='custom-bg p-4 hidden md:block'>
        <ul className='flex items-center justify-between max-w-7xl mx-auto'>
          <Link href='/' passHref>
            <li className='flex-shrink-0 cursor-pointer'>
              <Image
                src='/logo.png'
                alt='Gaming Logo'
                width={150}
                height={150}
                className='object-contain'
              />
            </li>
          </Link>

          {!searchOpen && (
            <li className='flex items-center gap-8 text-white text-lg font-medium'>
              <div
                className='relative cursor-pointer hover:text-yellow-400 transition-colors duration-300'
                onClick={() => setIsDesktopGamesOpen(!isDesktopGamesOpen)}
              >
                <div className='flex items-center space-x-1 select-none'>
                  <span>Games</span>
                  <MdKeyboardArrowDown size={22} />
                </div>
                {isDesktopGamesOpen && (
                  <div className='absolute top-full left-0 mt-5 bg-gray-800 rounded-md p-4 z-20 min-w-[200px]'>
                    <Link href='/ps5' passHref>
                      <span className='block cursor-pointer hover:text-yellow-800 py-3 px-5 rounded'>
                        PlayStation 5
                      </span>
                    </Link>
                    <Link href='/ps4' passHref>
                      <span className='block cursor-pointer hover:text-yellow-800 py-3 px-5 rounded'>
                        PlayStation 4
                      </span>
                    </Link>
                    <Link href='/xboxX' passHref>
                      <span className='block cursor-pointer hover:text-yellow-800 py-3 px-5 rounded'>
                        Xbox Series X
                      </span>
                    </Link>
                    <Link href='/xboxOne' passHref>
                      <span className='block cursor-pointer hover:text-yellow-800 py-3 px-5 rounded'>
                        Xbox One
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <Link href={'/products'}>
                <span className='cursor-pointer hover:text-yellow-400 transition-colors duration-300'>
                  Consoles
                </span>
              </Link>

              <Link href={'/products'}>
                <span className='cursor-pointer hover:text-yellow-400 transition-colors duration-300'>
                  Accessories
                </span>
              </Link>

              <Link href={'/askAI'}>
                <span className='cursor-pointer hover:text-yellow-400 transition-colors duration-300'>
                  Ask AI
                </span>
              </Link>
            </li>
          )}

          {/* Search Field */}
          {searchOpen && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <div className='w-[800px]  mx-auto px-4 mt-6'>
                <input
                  type='text'
                  placeholder='Search for games, consoles, accessories...'
                  value={searchContent}
                  onChange={e => setSearchContent(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSearch()
                  }}
                  className='w-full px-6 py-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-black shadow-md transition-all duration-300 ease-in-out'
                />
              </div>
            </motion.div>
          )}

          <li className='flex items-center gap-4'>
            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {searchOpen ? (
                <IoClose
                  size={30}
                  onClick={() => {
                    setSearchOpen(false)
                    clearSearch()
                  }}
                />
              ) : (
                <FaSearch size={24} onClick={() => setSearchOpen(true)} />
              )}
            </motion.div>

            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCartClick}
            >
              <BsCart4 size={32} />
            </motion.div>

            {!loggedIn ? (
              <Link href='/login' passHref>
                <motion.div
                  className='cursor-pointer text-white hover:text-yellow-400'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  <MdAccountCircle size={32} />
                </motion.div>
              </Link>
            ) : (
              <div className='max-w-[300px] p-4 text-center border-2 rounded-4xl '>
                <Link href='/userInformation' passHref>
                  <motion.div
                    className='cursor-pointer text-white hover:text-yellow-400'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAccountOpen(!accountOpen)}
                  >
                    {userInfo?.userName && <div>{fullName}</div>}
                  </motion.div>
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <nav className='custom-bg p-4 md:hidden'>
        <div className='flex items-center justify-between'>
          <motion.button
            onClick={toggleMobileMenu}
            className='text-white hover:text-yellow-400 z-50'
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <IoClose size={28} />
            ) : (
              <GiHamburgerMenu size={28} />
            )}
          </motion.button>

          <div className='flex-1 flex justify-center'>
            <Link href={'/'}>
              <Image
                src='/logo.png'
                alt='Gaming Logo'
                width={100}
                height={100}
                className='object-contain'
              />
            </Link>
          </div>

          <div className='flex items-center gap-3 z-50'>
            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400'
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              {searchOpen ? <IoClose size={24} /> : <FaSearch size={20} />}
            </motion.div>

            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400'
              whileTap={{ scale: 0.9 }}
              onClick={handleCartClick}
            >
              <BsCart4 size={24} />
            </motion.div>

            {!loggedIn ? (
              <Link href='/login' passHref>
                <motion.div
                  className='cursor-pointer text-white hover:text-yellow-400'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  <MdAccountCircle size={32} />
                </motion.div>
              </Link>
            ) : (
              <div className='max-w-[200px] p-3 text-center border-2 rounded-4xl '>
                <Link href='/userInformation' passHref>
                  <motion.div
                    className='cursor-pointer text-white hover:text-yellow-400'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAccountOpen(!accountOpen)}
                  >
                    {userInfo?.userName && <div>{userName}</div>}
                  </motion.div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Field */}
        {searchOpen && (
          <div className='px-4 pt-3'>
            <input
              type='text'
              placeholder='Search for games, consoles...'
              value={searchContent}
              onChange={e => setSearchContent(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch()
              }}
              className='w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white'
              autoFocus
            />
          </div>
        )}

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='fixed top-0 left-0 w-3/4 h-full custom-bg border-r border-gray-700 z-40 shadow-lg overflow-y-auto'
            >
              <ul className='py-12 px-6 space-y-4'>
                <li
                  className='text-white cursor-pointer hover:text-yellow-400 text-lg font-medium py-2 border-b border-gray-700 flex justify-between'
                  onClick={() => setIsMobileGamesOpen(!isMobileGamesOpen)}
                >
                  <span>Games</span>
                  <MdKeyboardArrowDown size={22} />
                </li>

                <AnimatePresence>
                  {isMobileGamesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className='mt-2 p-6 mx-2 shadow-lg max-h-[60vh] overflow-y-auto scroll rounded-md'
                    >
                      <ul className='flex flex-col space-y-6'>
                        <Link href='/ps5' passHref>
                          <li
                            className='text-yellow-400 text-2xl font-semibold cursor-pointer rounded-md px-3 py-2'
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            PlayStation 5
                          </li>
                        </Link>
                        <Link href='/ps4' passHref>
                          <li
                            className='text-yellow-400 text-2xl font-semibold cursor-pointer rounded-md px-3 py-2'
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            PlayStation 4
                          </li>
                        </Link>
                        <Link href='/games/xsx' passHref>
                          <li
                            className='text-yellow-400 text-2xl font-semibold cursor-pointer rounded-md px-3 py-2'
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Xbox Series X
                          </li>
                        </Link>
                        <Link href='/games/xone' passHref>
                          <li
                            className='text-yellow-400 text-2xl font-semibold cursor-pointer rounded-md px-3 py-2'
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Xbox One
                          </li>
                        </Link>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                <li
                  className='text-white cursor-pointer hover:text-yellow-400 text-lg font-medium py-2 border-b border-gray-700'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Consoles
                </li>
                <li
                  className='text-white cursor-pointer hover:text-yellow-400 text-lg font-medium py-2 border-b border-gray-700'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accessories
                </li>
                <li
                  className='text-white cursor-pointer hover:text-yellow-400 text-lg font-medium py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ask AI
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  )
}

export default NavBar

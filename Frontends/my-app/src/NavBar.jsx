'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MdAccountCircle } from 'react-icons/md'
import { FaSearch } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose } from 'react-icons/io5'
import { MdKeyboardArrowDown } from "react-icons/md"

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const NavMenu = ['Games', 'Consoles', 'Accessories', 'Ask_AI']

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
          {/* Logo */}
          <li className='flex-shrink-0'>
            <Image
              src='/logo.png'
              alt='Gaming Logo'
              width={150}
              height={150}
              className='object-contain'
            />
          </li>

          {/* Navigation Menu */}
          <li className='flex items-center gap-8'>
            {NavMenu.map((item, index) => (
              <motion.span
                key={index}
                className='text-white cursor-pointer hover:text-yellow-400 text-lg font-medium transition-colors duration-300 relative group'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item === 'Games' ? (
                  <div className='flex space-x-1 items-center'>
                    <span>{item}</span>
                    <MdKeyboardArrowDown size={22} />
                  </div>
                ) : (
                  <>
                    {item.replace('_', ' ')}
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full'></span>
                  </>
                )}
              </motion.span>
            ))}
          </li>

          {/* User Actions */}
          <li className='flex items-center gap-4'>
            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400 transition-colors duration-300'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaSearch size={24} />
            </motion.div>
            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400 transition-colors duration-300'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdAccountCircle size={32} />
            </motion.div>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <nav className='custom-bg p-4 md:hidden'>
        <div className='flex items-center justify-between'>
          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={toggleMobileMenu}
            className='text-white hover:text-yellow-400 transition-colors duration-300 z-50 relative'
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <IoClose size={28} />
            ) : (
              <GiHamburgerMenu size={28} />
            )}
          </motion.button>

          {/* Logo */}
          <div className='flex-1 flex justify-center'>
            <Image
              src='/logo.png'
              alt='Gaming Logo'
              width={100}
              height={100}
              className='object-contain'
            />
          </div>

          {/* Mobile User Actions */}
          <div className='flex items-center gap-3'>
            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400 transition-colors duration-300'
              whileTap={{ scale: 0.9 }}
            >
              <FaSearch size={20} />
            </motion.div>
            <motion.div
              className='cursor-pointer text-white hover:text-yellow-400 transition-colors duration-300'
              whileTap={{ scale: 0.9 }}
            >
              <MdAccountCircle size={24} />
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='fixed top-0 left-0 w-3/4 h-full custom-bg border-r border-gray-700 z-40 shadow-lg'
            >
              <ul className='py-12 px-6 space-y-4'>
                {NavMenu.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className='text-white cursor-pointer hover:text-yellow-400 text-lg font-medium py-2 border-b border-gray-700 last:border-b-0 transition-colors duration-300 flex items-center justify-between'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.replace('_', ' ')}</span>
                    {item === 'Games' && <MdKeyboardArrowDown size={22} />}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  )
}

export default NavBar

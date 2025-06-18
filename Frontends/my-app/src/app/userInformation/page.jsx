'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { MdDelete, MdDashboard } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { UserInformationContext } from '../../context/UserInformation'
import userAvatar from '../../../public/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg'
import Image from 'next/image'
import { CiUser, CiHeart } from 'react-icons/ci'
import { IoIosLogOut } from 'react-icons/io'

const page = () => {
  const [userCart, setUserCart] = useState([])
  const [productsData, setProductsData] = useState([])
  const [image, setImage] = useState(null)
  const [userName, setUserName] = useState('')
  const [fullName, setFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [memeberShipDate, setMemeberShipDate] = useState('')
  const [cartItems, setCartItems] = useState('')
  const router = useRouter()
  const { userInfo, loggedIn } = useContext(UserInformationContext)
  const [loading, setLoading] = useState(false)

  console.log('User Cart Data is : ', userCart)
  console.log('Products Data is : ', productsData)
  console.log('Image Data is : ', image)
  console.log('User Name is : ', userName)
  console.log('Full Name is : ', fullName)
  console.log('UserInformation is :', userInfo)
  console.log('User ID : ', userId)
  console.log('MemberShipDate : ', memeberShipDate)
  console.log('Total Length of cart is : ', cartItems)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/cart/user-cart', {
          withCredentials: true
        })
        console.log('Cart Data is : ', res)
        setUserCart(res.data.cart)
      } catch (err) {
        console.error('Error fetching cart:', err)
        if (err.response?.status === 401) {
          router.push('/login')
        }
      }
    }

    fetchCart()
  }, [])

  useEffect(() => {
    const fetchAllProductDetails = async () => {
      try {
        setLoading(true)
        const productPromises = userCart.map(item => {
          const url = `http://localhost:5000/productsItems/${item.productType}/${item.productId}`
          return axios.get(url)
        })

        const responses = await Promise.allSettled(productPromises)
        const combinedData = responses
          .map((res, index) => {
            if (res.status === 'fulfilled') {
              return {
                ...res.value.data.game,
                quantity: userCart[index].quantity,
                productType: userCart[index].productType,
                productId: userCart[index].productId
              }
            } else {
              console.warn(
                `Failed to fetch product: ${userCart[index].productType}/${userCart[index].productId}`,
                res.reason?.response?.status
              )
              return null
            }
          })
          .filter(Boolean)

        setProductsData(combinedData)
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error in fetchAllProductDetails:', err)
      }
    }

    if (userCart.length > 0) {
      fetchAllProductDetails()
    } else {
      setProductsData([])
    }
  }, [userCart])

  useEffect(() => {
    if (productsData[0]?.Type === 'Console') {
      setImage(Object.values(productsData[0].images_by_color)[0])
    }
  }, [productsData])

  useEffect(() => {
    if (userInfo && userInfo.userName) {
      const username = userInfo.userName.split(' ')[0]
      setUserName(username)
      setFullName(userInfo.userName)
      setUserEmail(userInfo.userEmail)
      setUserId(userInfo._id)
      const newDate = new Date(userInfo.createdAt)
      const options = { day: 'numeric', month: 'long', year: 'numeric' }
      const formattedDate = newDate.toLocaleDateString('en-US', options)
      setMemeberShipDate(formattedDate)
      setCartItems(userInfo.cart.length)
    }
  }, [userInfo])

  useEffect(() => {
    const checkCookie = async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include'
        })
        console.log('Response is Logout : ', res)
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

  const totalAmount = productsData.reduce(
    (acc, item) => acc + item.price_inr * item.quantity,
    0
  )

  const productNames = productsData.map(
    p => p.full_name || p.base_name || p.console_name || 'Unnamed Product'
  )

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-white'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500'></div>
        <p className='ml-4 text-lg text-gray-700 font-medium'>Loading...</p>
      </div>
    )
  }

  const handleRemoveFromCart = async (productId, quantity, productType) => {
    try {
      await axios.post(
        'http://localhost:5000/cart/remove',
        {
          productId,
          productQuantity: quantity,
          productType
        },
        {
          withCredentials: true
        }
      )

      setUserCart(prev =>
        prev.filter(
          item =>
            item.productId !== productId || item.productType !== productType
        )
      )
    } catch (err) {
      console.error('Error removing from cart:', err)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      })

      console.log('Response from the Logout route is :', res)

      if (!res.ok) {
        console.log('hey I am error ')
        console.error('Logout failed')
        throw new Error('Logout failed')
      }

      setUserName('')
      setFullName('')
      setUserEmail('')
      setUserId('')
      setUserCart([])
      setProductsData([])
      router.push('/')
      // refresh the page
      window.location.href = '/'
    } catch (err) {
      console.error('Error logging out:', err)
      router.push('/')
    }
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className='bg-[rgb(235,237,242)] dark:bg-[#1e1e1e] min-h-screen'
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className='flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-6 rounded-2xl shadow-md bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-4 justify-between w-full sm:w-auto'>
            <div className='p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full'>
              <MdDashboard
                size={32}
                className='text-indigo-600 dark:text-indigo-300'
              />
            </div>

            <button
              onClick={handleLogout}
              className='p-3 bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200 cursor-pointer'
              title='Logout'
            >
              <IoIosLogOut
                className='text-red-600 dark:text-red-300'
                size={32}
              />
            </button>
          </div>

          <div className='text-center sm:text-left'>
            <h1 className='text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white'>
              User Dashboard
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Welcome back,{' '}
              <span className='font-semibold text-gray-800 dark:text-white text-base sm:text-lg'>
                {fullName || 'Guest'}!
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className='p-4 sm:p-5 lg:p-10'
      >
        <div className='bg-white dark:bg-[#1e1e1e] p-4 sm:p-6 rounded-2xl shadow-md mt-6 sm:mt-10 min-h-screen'>
          <div className='flex flex-col md:flex-row items-center gap-6 justify-center'>
            <div className='relative'>
              <Image
                className='rounded-full w-[80px] h-[80px] md:w-[100px] md:h-[100px]'
                src='/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg'
                alt='User Image'
                width={100}
                height={100}
              />
              <div className='absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white'></div>
            </div>

            <div className='text-center md:text-left'>
              <h1 className='text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white'>
                {fullName || 'Guest'}
              </h1>
              <h1 className='text-base sm:text-lg font-semibold text-gray-400 dark:text-gray-300 break-all'>
                {userEmail || 'Guest'}
              </h1>
            </div>
          </div>

          <div className='flex items-center gap-4 flex-col justify-center'>
            <div className='bg-[rgb(244,242,254)] dark:bg-gray-800 mt-10 border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-4 sm:p-5 text-black dark:text-white w-full md:w-3/4 lg:w-1/2'>
              <div className='flex items-center gap-4'>
                <div>
                  <CiUser
                    size={40}
                    className='text-indigo-600 dark:text-indigo-400'
                  />
                </div>

                <div>
                  <h1 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    User Details
                  </h1>
                </div>
              </div>

              <div className='flex items-center gap-4 mt-5 justify-between flex-wrap'>
                <div>
                  <h1 className='font-bold text-gray-800 dark:text-white'>
                    User ID:
                  </h1>
                </div>
                <div className='break-all'>
                  <h1 className='font-semibold text-gray-500 dark:text-gray-400 text-sm sm:text-base'>
                    {userId}
                  </h1>
                </div>
              </div>

              <div className='flex items-center gap-4 mt-5 justify-between flex-wrap'>
                <div>
                  <h1 className='font-bold text-gray-800 dark:text-white'>
                    Member Since:
                  </h1>
                </div>

                <div>
                  <h1 className='font-semibold text-gray-500 dark:text-gray-400'>
                    {memeberShipDate}
                  </h1>
                </div>
              </div>

              <div className='flex justify-between mt-5 flex-wrap gap-2'>
                <span className='font-bold text-gray-800 dark:text-white'>
                  Status:
                </span>
                <span className='text-green-600 font-medium flex items-center'>
                  <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-4 flex-col justify-center'>
            <div className='bg-[rgb(244,242,254)] dark:bg-gray-800 mt-10 border-2 border-gray-200 dark:border-gray-600 rounded-2xl p-4 sm:p-5 text-black dark:text-white w-full md:w-3/4 lg:w-1/2'>
              <div className='flex items-center gap-4'>
                <div>
                  <CiHeart
                    size={40}
                    className='text-indigo-600 dark:text-indigo-400'
                  />
                </div>

                <div>
                  <h1 className='text-lg font-semibold text-gray-800 dark:text-white'>
                    Quick Stats
                  </h1>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-center mt-4'>
                <div className='bg-white dark:bg-gray-700 rounded-lg p-3'>
                  <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                    {cartItems}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    Cart Items
                  </div>
                </div>
                <div className='bg-white dark:bg-gray-700 rounded-lg p-3'>
                  <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
                    0
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    Total Orders
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default page

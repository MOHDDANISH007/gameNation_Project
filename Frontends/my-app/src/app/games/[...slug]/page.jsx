'use client'

import React, { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FaPlus } from 'react-icons/fa'
import Link from 'next/link'
import { FaCartShopping } from 'react-icons/fa6'

const Page = ({ params }) => {
  const { slug } = use(params)
  const id = slug?.[1]
  let rootSlug = slug?.[0]
  console.log(rootSlug, id)

  const [activeTab, setActiveTab] = useState('Overview')
  const [games, setGames] = useState({})
  const [loading, setLoading] = useState(false)
  const [youtubeLink, setYoutubeLink] = useState('')
  const [openFAQIndex, setOpenFAQIndex] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const BASE_URL = 'https://gamenation-project-backend.onrender.com'
  console.log('games', games)


  // if (rootSlug === 'xboxX') {
  //   rootSlug = 'xbox_x'
  // } else if (rootSlug === 'xboxOne') {
  //   rootSlug = 'xbox_one'
  // }

  let slugSegment = rootSlug
  console.log('slugSegment', slugSegment)

  const tabs = ['Overview', 'Details', 'FAQ', 'Similar Games']

  const getEmbedUrl = url => {
    try {
      const parsed = new URL(url)
      if (parsed.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
      }
      if (
        parsed.hostname.includes('youtube.com') &&
        parsed.searchParams.has('v')
      ) {
        return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`
      }
      return null
    } catch {
      return null
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${BASE_URL}/${rootSlug}/${id}`
        )
        const details = response.data[`${rootSlug}Details`] // ✅ dynamic key
        console.log('details', details)
        setGames(details)
        setYoutubeLink(getEmbedUrl(details.trailerVideo))
      } catch (err) {
        console.error('Error fetching game details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, rootSlug])

  function getCookieValue (name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  const handleAddToCart = async () => {
    const token = getCookieValue('token') // your cookie name
    console.log('Token:', token)

    try {
      const res = await axios.post(
        `${BASE_URL}/cart/add`,
        {
          productId: id,
          quantity,
          productType: slugSegment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )

      console.log(res.data.message)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
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
    <motion.div>
      <div className='min-h-screen bg-gradient-to-br p-4 from-slate-900 via-purple-900 to-slate-900'>
        {/* Tabs */}
        <motion.div className='border-b border-gray-600 border-opacity-50 pt-4'>
          <ul className='flex flex-wrap gap-4 p-4 text-white justify-center'>
            {tabs.map(tab => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer font-bold text-lg md:text-2xl ${
                  activeTab === tab ? 'underline' : ''
                }`}
              >
                {tab}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Content */}
        {activeTab === 'Overview' && games && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className='px-4 py-2 text-white'
          >
            <div>
              <h1 className='text-3xl md:text-4xl p-4 md:p-10 font-bold'>
                Game Gallery & Trailer
              </h1>

              <div className='flex flex-col lg:flex-row gap-6 p-4 md:p-10 justify-evenly items-center'>
                <div className='w-full lg:w-1/2'>
                  {games.image && (
                    <img
                      src={games.image}
                      alt={games.title}
                      className='h-auto max-h-[500px] object-cover rounded-md'
                    />
                  )}
                </div>

                <div className='w-full lg:w-1/2'>
                  {youtubeLink && (
                    <iframe
                      src={youtubeLink}
                      height='300'
                      width='100%'
                      allowFullScreen
                      className='mt-4 w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg'
                    />
                  )}
                </div>
              </div>

              <div className='text-center py-6 px-4 space-y-2'>
                <h2 className='text-2xl md:text-3xl font-bold text-blue-400'>
                  {games.title}
                </h2>
                <p className='text-lg md:text-xl text-gray-300'>
                  Developed by:{' '}
                  <span className='font-semibold text-white'>
                    {games.developer}
                  </span>
                </p>
                <p className='text-lg md:text-xl text-gray-300'>
                  Price:{' '}
                  <span className='font-semibold text-white'>
                    ₹{games.price}
                  </span>
                </p>

                <div className='md:flex md:justify-center md:items-center md:gap-2 flex justify-center flex-col items-center'>
                  <div className='mt-4 w-fit bg-white p-4 rounded-xl flex flex-row gap-5 shadow-md'>
                    <div className='mb-2'>
                      <h1 className='text-lg font-semibold text-gray-700'>
                        Quantity:
                      </h1>
                    </div>
                    <div className='flex items-center gap-4'>
                      <button
                        disabled={quantity <= 0}
                        onClick={() => setQuantity(quantity - 1)}
                        className={`w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-xl font-bold transition ${
                          quantity <= 0
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer hover:bg-gray-300'
                        }`}
                      >
                        -
                      </button>
                      <p className='text-lg text-black font-medium w-6 text-center'>
                        {quantity}
                      </p>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className='cursor-pointer w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-xl font-bold hover:bg-gray-300 transition'
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* <div className='p-1 mt-4'>
                    <Link href={`/cart/${slugSegment}/${id}?quantity=${quantity}`}>
                      <button className='cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 shadow-md'>
                        <FaCartShopping className='text-lg' />
                        <span className='font-semibold'>Add to Cart</span>
                      </button>
                    </Link>
                  </div> */}

                  <div className='p-1 mt-4'>
                    <button
                      onClick={handleAddToCart}
                      className='cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 shadow-md'
                    >
                      <FaCartShopping className='text-lg' />
                      <span className='font-semibold'>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>

              <h1 className='text-3xl md:text-4xl p-4 md:p-10 font-bold'>
                About This Game
              </h1>

              <div>
                <p className='text-base md:text-xl p-4 md:p-10'>
                  {games.about}
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4'>
                  <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
                    <h3 className='text-lg md:text-xl font-semibold mb-4 text-blue-400'>
                      Game Features
                    </h3>
                    <ul className='space-y-2 text-gray-300 text-sm md:text-base'>
                      <li>• Enhanced 4K visuals and 60 FPS gameplay</li>
                      <li>• DualSense haptic feedback integration</li>
                      <li>• Massive open-world environment</li>
                      <li>• Single-player campaign experience</li>
                      <li>• No internet connection required</li>
                    </ul>
                  </div>

                  <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10'>
                    <h3 className='text-lg md:text-xl font-semibold mb-4 text-blue-400'>
                      Technical specs
                    </h3>
                    <div className='space-y-2 text-sm md:text-base'>
                      <div className='flex justify-between'>
                        <span className='font-semibold'>Platform:</span>
                        <span>{games.platform?.join(', ')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-semibold'>Genre:</span>
                        <span>{games.genre}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-semibold'>Publisher:</span>
                        <span>{games.publisher}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-semibold'>Origin:</span>
                        <span>{games.countryOfOrigin}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-semibold'>Release Date:</span>
                        <span>{games.releaseDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Details' && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div className='px-4 py-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-xl md:text-3xl font-semibold mb-4 text-white'>
                    Game Details
                  </h3>
                  <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-3 text-sm md:text-base'>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Game Type:</span>
                      <span>{games.gameType}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Gameplay Hours:</span>
                      <span>{games.gameplayHours}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Internet Required:</span>
                      <span>{games.internetRequired}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>PS Plus Required:</span>
                      <span>{games.psPlusRequired}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>PEGI Rating:</span>
                      <span className='border border-white/10 p-2 bg-red-800'>
                        {games.pegiRating}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-xl md:text-3xl font-semibold mb-4 text-white'>
                    Publisher Info
                  </h3>
                  <div className='bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-3 text-sm md:text-base'>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Publisher:</span>
                      <span>{games.publisher}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Developer:</span>
                      <span>{games.developer}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Origin:</span>
                      <span>{games.countryOfOrigin}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Release Date:</span>
                      <span>{games.releaseDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ */}

        {activeTab === 'FAQ' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='px-4 py-6'>
              <h1 className='text-2xl md:text-4xl font-semibold mb-6 text-white text-center'>
                Frequently Asked Questions
              </h1>
              <div className='grid grid-cols-1 gap-4 max-w-4xl mx-auto'>
                {games.faqs?.map((faq, index) => (
                  <div
                    key={index}
                    className='bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10'
                  >
                    <div className='flex justify-between items-center'>
                      <h3 className='text-base sm:text-lg md:text-xl font-semibold text-blue-400'>
                        {faq.question}
                      </h3>
                      <FaPlus
                        className='cursor-pointer text-white'
                        onClick={() =>
                          setOpenFAQIndex(openFAQIndex === index ? null : index)
                        }
                      />
                    </div>
                    {openFAQIndex === index && (
                      <p className='text-sm sm:text-base mt-2 transition-all duration-300 text-gray-200'>
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* similar games */}
        {activeTab === 'Similar Games' && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='w-full'
          >
            <div className='px-4 py-8 md:px-8 md:py-12 w-full '>
              <h1 className='text-2xl md:text-4xl font-bold mb-8 text-white text-center tracking-tight'>
                Games You'll Love
              </h1>

              <div className='flex gap-6 overflow-x-auto scroll scrollbar-custom px-4 py-2 snap-x snap-mandatory'>
                {games.similarProducts?.map((game, index) => (
                  <div
                    key={index}
                    className='min-w-[260px] sm:min-w-[320px] flex-shrink-0 bg-gray-800/70 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 snap-start group'
                  >
                    <div className='relative overflow-hidden  rounded-lg mb-4'>
                      <img
                        src={game.image}
                        alt={game.name}
                        className='w-full h-[360px] sm:h-[200px] object-cover transition-transform duration-300 group-hover:scale-105'
                        loading='lazy'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>
                    <h2 className='text-lg md:text-xl font-semibold text-blue-300 group-hover:text-blue-400 transition-colors duration-200'>
                      {game.name}
                    </h2>
                    <p className='text-sm md:text-base text-gray-400 mt-2 line-clamp-3'>
                      {game.description}
                    </p>
                    <div className='flex justify-between items-center mt-4'>
                      <p className='text-base md:text-lg font-medium text-white'>
                        ₹{game.price}
                      </p>
                      <Link href={`/games/${rootSlug}/${game.id}`}>
                        <button className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200'>
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Page

'use client'

import React, { useEffect, useState } from 'react'
import { useData } from '@/context/DataContext.jsx'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const Ps5Component = () => {
  const { dataFromBackendForPS5, loading, setLoading } = useData()
  const [games, setGames] = useState([])
  const searchParams = useSearchParams()
  const query = searchParams.get('query')?.trim().toLowerCase()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await dataFromBackendForPS5()
      console.log('Fetched data:', data)

      if (data && Array.isArray(data.ps5s)) {
        setGames(data.ps5s)
      } else {
        console.error('Unexpected data format:', data)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const filterData = games.filter(game => {
    const name = game?.game_name?.toLowerCase().replace(/\s+/g, '')
    const search = query?.replace(/\s+/g, '')
    return name && search && name.includes(search)
  })

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-white'>
        <div className='text-2xl'>Loading consoles...</div>
      </div>
    )
  }

  const displayGames = query ? filterData : games

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <div className='text-white px-4 py-6'>
        <h1 className='text-3xl underline p-2 font-bold mb-4'>
          PlayStation 5 Games
        </h1>

        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {displayGames.map(game => (
            <Link key={game.game_id} href={`/games/ps5/${game.game_id}`}>
              <li className='bg-gray-800 p-4 rounded shadow cursor-pointer hover:bg-gray-700 transition'>
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
              </li>
            </Link>
          ))}
        </ul>

        {query && filterData.length === 0 && (
          <p className='text-white text-xl font-semibold text-center mt-6'>
            No game found by this name.
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default Ps5Component

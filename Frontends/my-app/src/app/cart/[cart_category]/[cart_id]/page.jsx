'use client'

import React, { useEffect, useState, use } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { MdDelete } from 'react-icons/md'

const Page = ({ params }) => {
  const [products, setProducts] = useState(null)

  const searchParams = useSearchParams()
  const quantity = searchParams.get('quantity')

  const { cart_id, cart_category } = use(params)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://gamenation-project-backend.onrender.com/productsItems/                    
  ${cart_category}/${cart_id}`
        )
        setProducts(res.data.game)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    if (cart_id && cart_category) {
      fetchData()
    }
  }, [cart_id, cart_category])

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6"
    >
      <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">🛒 My Cart</h1>

      {products ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Product Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-xl">
            <img
              className="w-40 h-auto object-cover rounded-xl shadow-md"
              src={products.image_link}
              alt={products.base_name}
            />
            <div className="flex-1 space-y-3">
              <p className="text-2xl font-bold text-white">{products.full_name}</p>
              <p className="text-lg text-gray-300">Quantity: {quantity}</p>
            </div>
            <button className="text-red-500 cursor-pointer hover:text-red-600 transition duration-200">
              <MdDelete size={30} />
            </button>
          </div>

          {/* Billing Info */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-3xl font-bold text-yellow-400">🧾 Billing Info</h2>
            <p className="text-lg"><span className="font-semibold text-white">Name:</span> {products.full_name}</p>
            <p className="text-lg"><span className="font-semibold text-white">Platform:</span> {products.platform}</p>
            <p className="text-lg"><span className="font-semibold text-white">Price:</span> ₹{products.price_inr}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-300 text-xl mt-10">Loading your cart...</div>
      )}
    </motion.div>
  )
}

export default Page

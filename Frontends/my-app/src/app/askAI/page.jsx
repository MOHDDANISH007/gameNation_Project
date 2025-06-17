'use client'

import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'
import { motion } from 'framer-motion'
import { IoGameController } from 'react-icons/io5'
import { Search, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const AskAIPage = () => {
  const router = useRouter()

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content:
        '🎮 Welcome to AI Game Assistant! \n\nBefore we start, let me guide you on how to get the best help:',
      navigationGuide: {
        title: '📋 How to Use This Assistant',
        description:
          "I can help you in TWO different ways. Choose the approach that matches what you're looking for:",
        routes: [
          {
            number: '1️⃣',
            title: 'Ask About ANY Game',
            subtitle: 'General Gaming Questions & Advice',
            description:
              'Perfect for getting information about games from anywhere - not just our platform',
            useCases: [
              '• Get reviews and ratings for any game',
              '• Ask for gaming recommendations',
              '• Learn about game genres and mechanics',
              '• Get gaming tips and strategies',
              '• Compare different games'
            ],
            examples: [
              'What is Elden Ring about?',
              'Best horror games of 2024?',
              'How to get better at FPS games?'
            ],
            promptTemplate:
              "💬 Example: 'Tell me about [Any Game Name]' or 'What are the best [Genre] games?'"
          },
          {
            number: '2️⃣',
            title: 'Check Our Platform',
            subtitle: 'Platform Availability & Catalog Search',
            description:
              'Specifically check if games are available on OUR platform and get platform-specific details',
            useCases: [
              '• Check if a specific game is available here',
              "• Browse our platform's game catalog",
              '• Get platform-specific pricing and details',
              '• Find platform exclusives',
              "• See what's trending on our platform"
            ],
            examples: [
              'Is Minecraft available on your platform?',
              'Show me your RPG games',
              "What's the price of Cyberpunk 2077 here?"
            ],
            promptTemplate:
              "🔍 Example: 'Is [Game Name] available on your platform?' or 'Show me your [Genre] games'"
          }
        ]
      }
    }
  ])

  const [games, setGames] = useState([])
  const [rootSlug, setRootSlug] = useState('')
  const [id, setId] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  console.log('Products :', products)
  console.log('Games :', games)
  console.log('Youtube Link :', youtubeLink)

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
    const checkCookie = async () => {
      try {
        const res = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include'
        })
        if (!res.ok) {
          router.push('/login')
        }
      } catch (err) {
        console.error('Auth check failed:', err)
      }
    }
    checkCookie()
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      if (!rootSlug || !id) return
      try {
        setLoading(true)
        const response = await axios.get(
          `http://localhost:5000/productsItems/${rootSlug}/${id}`
        )
        const details = response.data[`${rootSlug}Details`]
        setProducts(details)
        setYoutubeLink(getEmbedUrl(details?.trailerVideo))
      } catch (err) {
        console.error('Error fetching game details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, rootSlug])

  const handleToSubmit = async () => {
    if (!query.trim()) return
    try {
      const res = await fetch('http://localhost:5000/askAI/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      setGames(data.availableGame || [])

      const available = data.availableGame?.[0]
      if (available) {
        setRootSlug(available.platform?.toLowerCase() || '')
        setId(available.game_id || '')
      }

      setAiResponse(data.aiResponse || 'No AI response found.')
      setQuery('')
    } catch (err) {
      console.error('Submit failed:', err)
      setAiResponse('Something went wrong.')
    }
  }
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1.5 }}
      className='bg-white text-black min-h-screen'
    >
      <div className='flex justify-between items-center p-6'>
        <div className='flex items-center gap-4'>
          <img
            src='/ai-assistant.png'
            className='w-16 h-16'
            alt='AI Assistant'
          />
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-bold'>GameNation AI Assistant</h1>
            <p className='text-lg'>Choose your assistance mode below</p>
          </div>
        </div>

        <div className='flex border border-green-500 rounded-full px-4 py-2'>
          <div className='w-2 h-2 bg-green-500 rounded-full mr-2 mt-3'></div>
          <button className='text-green-500'>
            <span className='font-bold mr-2 text-xl'>online</span>
          </button>
        </div>
      </div>

      <div className='opacity-50 bg-gradient-to-r from-indigo-500 to-purple-600 h-1'></div>

      <div className='p-10'>
        <div className='mt-4 p-6 max-w-2xl  bg-gray-50 rounded-md border text-gray-800'>
          <div className='flex items-center gap-4'>
            <IoGameController size={30} />
            <p className='text-lg font-bold'>
              {' '}
              Welcome to GameNation AI Assistant!{' '}
            </p>
          </div>

          <div className='mt-4 flex flex-row'>
            <p className='text-lg ml-10'>
              Before we start, let me guide you on how to get the best help:
            </p>
          </div>
        </div>
      </div>

      {/* Guide Box */}
      <div className='p-6 max-w-5xl mx-auto'>
        {messages[0].navigationGuide && (
          <div className='mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100'>
            <div className='text-center mb-8'>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {messages[0].navigationGuide.title}
              </h3>
              <p className='text-gray-700'>
                {messages[0].navigationGuide.description}
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {messages[0].navigationGuide.routes.map((route, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100'
                >
                  <div className='flex items-start space-x-4 mb-4'>
                    <div className='text-3xl'>{route.number}</div>
                    <div className='flex-1'>
                      <h4 className='text-xl font-bold text-gray-900'>
                        {route.title}
                      </h4>
                      <p className='text-sm font-medium text-indigo-600 mb-2'>
                        {route.subtitle}
                      </p>
                      <p className='text-gray-600 text-sm'>
                        {route.description}
                      </p>
                    </div>
                  </div>

                  <div className='mb-4'>
                    <h5 className='font-semibold text-gray-900 mb-2'>
                      ✨ What you can do:
                    </h5>
                    <div className='space-y-1'>
                      {route.useCases.map((useCase, useCaseIndex) => (
                        <p key={useCaseIndex} className='text-sm text-gray-600'>
                          {useCase}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className='mb-4'>
                    <h5 className='font-semibold text-gray-900 mb-2'>
                      💡 Example Questions:
                    </h5>
                    <div className='space-y-1'>
                      {route.examples.map((example, exampleIndex) => (
                        <p
                          key={exampleIndex}
                          className='text-sm text-gray-500 italic'
                        >
                          • "{example}"
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className='bg-gray-50 rounded-xl p-4'>
                    <h5 className='font-semibold text-gray-900 mb-2'>
                      📝 How to Ask:
                    </h5>
                    <p className='text-sm text-gray-700 font-mono bg-white px-3 py-2 rounded border'>
                      {route.promptTemplate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ask AI Input & Response */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className='p-6 max-w-4xl mx-auto'>
          <h1 className='text-3xl font-extrabold mb-6 text-blue-700'>
            🔮 Ask Gemini AI
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {aiResponse && (
              <div className='mt-8 p-6 bg-gray-50 rounded border text-gray-800 markdown-body prose prose-slate max-w-none'>
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: props => (
                      <h1
                        className='text-3xl font-bold text-purple-700 mt-6 mb-3'
                        {...props}
                      />
                    ),
                    h2: props => (
                      <h2
                        className='text-2xl font-semibold text-indigo-600 mt-5 mb-2'
                        {...props}
                      />
                    ),
                    h3: props => (
                      <h3
                        className='text-xl text-blue-500 mt-4 mb-2'
                        {...props}
                      />
                    ),
                    p: props => (
                      <p
                        className='my-2 leading-relaxed text-gray-700'
                        {...props}
                      />
                    ),
                    code: ({ children }) => (
                      <code className='bg-gray-200 px-1 rounded text-sm text-red-500'>
                        {children}
                      </code>
                    ),
                    li: props => (
                      <li className='ml-6 list-disc'>{props.children}</li>
                    ),
                    blockquote: props => (
                      <blockquote
                        className='border-l-4 border-blue-400 pl-4 italic text-gray-600 my-4'
                        {...props}
                      />
                    )
                  }}
                >
                  {aiResponse}
                </ReactMarkdown>
              </div>
            )}
          </motion.div>

          <div className='relative mt-8'>
            <div className='flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-300 focus-within:bg-white transition-all'>
              <Search className='h-5 w-5 text-gray-500' />
              <input
                type='text'
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleToSubmit() // or your function name
                  }
                }}
                placeholder='Ask me about games, search for specific titles, or get recommendations...'
                className='flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500'
              />
              <button
                onClick={handleToSubmit}
                disabled={!query.trim()}
                className='p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Send className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* <input
          type='text'
          placeholder='Type your question here...'
          className='border mt-10 p-3 w-full rounded mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          onChange={e => setQuery(e.target.value)}
          value={query}
        />

        <button
          onClick={handleToSubmit}
          className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 px-5 rounded shadow hover:scale-105 transition-transform'
        >
          Ask Now
        </button> */}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AskAIPage

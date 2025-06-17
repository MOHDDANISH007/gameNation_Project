"use client"
import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Search,
  Gamepad2,
  Star,
  Calendar,
  Users,
  Zap,
  Sparkles
} from 'lucide-react'

const AIGameSection = () => {
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
      },
      promptOptions: [
        {
          title: '💬 Ask About ANY Game',
          description:
            'Questions about games from anywhere - reviews, tips, recommendations',
          buttonText: 'Start General Q&A',
          color: 'indigo'
        },
        {
          title: '🔍 Check Our Platform',
          description:
            'Search our catalog and check game availability on our platform',
          buttonText: 'Search Platform',
          color: 'purple'
        }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [currentMode, setCurrentMode] = useState(null) // 'general' or 'platform'
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Mock game database
  const gameDatabase = {
    'cyberpunk 2077': {
      name: 'Cyberpunk 2077',
      available: true,
      genre: 'Action RPG',
      rating: 4.2,
      releaseDate: '2020',
      players: 'Single-player',
      description:
        'An open-world action-adventure RPG set in the futuristic Night City.',
      price: '$29.99',
      image:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop'
    },
    'the witcher 3': {
      name: 'The Witcher 3: Wild Hunt',
      available: true,
      genre: 'Action RPG',
      rating: 4.8,
      releaseDate: '2015',
      players: 'Single-player',
      description:
        'Epic fantasy RPG following Geralt of Rivia in his final adventure.',
      price: '$19.99',
      image:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop'
    },
    minecraft: {
      name: 'Minecraft',
      available: true,
      genre: 'Sandbox',
      rating: 4.7,
      releaseDate: '2011',
      players: 'Single-player / Multiplayer',
      description:
        'Build, explore, and survive in infinite procedurally generated worlds.',
      price: '$26.95',
      image:
        'https://images.unsplash.com/photo-1606838512749-dea93eaa0fa4?w=300&h=200&fit=crop'
    },
    valorant: {
      name: 'Valorant',
      available: false,
      genre: 'Tactical Shooter',
      rating: 4.3,
      releaseDate: '2020',
      players: 'Multiplayer',
      description:
        '5v5 character-based tactical shooter with unique agent abilities.',
      price: 'Free-to-play',
      image:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop'
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = query => {
    const lowerQuery = query.toLowerCase()

    if (currentMode === 'platform') {
      // Platform-specific search responses
      const gameKeys = Object.keys(gameDatabase)
      const foundGame = gameKeys.find(key => lowerQuery.includes(key))

      if (foundGame) {
        const game = gameDatabase[foundGame]
        return {
          id: Date.now(),
          type: 'ai',
          content: game.available
            ? `✅ **${game.name}** is available on our platform! Here are the details:`
            : `❌ **${game.name}** is not currently available on our platform. Check back later for updates!`,
          gameInfo: game.available ? game : null,
          suggestions: game.available
            ? []
            : [
                'Show me similar games',
                'Browse available RPG games',
                'What games are trending?'
              ]
        }
      }

      // Platform search without specific game
      if (
        lowerQuery.includes('show') ||
        lowerQuery.includes('browse') ||
        lowerQuery.includes('available')
      ) {
        const availableGames = Object.values(gameDatabase).filter(
          game => game.available
        )
        return {
          id: Date.now(),
          type: 'ai',
          content: 'Here are the games currently available on our platform:',
          recommendations: availableGames
        }
      }

      return {
        id: Date.now(),
        type: 'ai',
        content:
          "🔍 I'm in Platform Search mode. Type a game name to check if it's available on our platform, or browse our catalog:",
        suggestions: [
          'Search for Minecraft',
          'Is The Witcher 3 available?',
          'Show me all available games',
          'Browse RPG games on platform'
        ]
      }
    } else if (currentMode === 'general') {
      // General gaming questions and advice
      if (lowerQuery.includes('best') || lowerQuery.includes('recommend')) {
        return {
          id: Date.now(),
          type: 'ai',
          content:
            'Based on current gaming trends and reviews, here are some highly recommended games across different genres:',
          recommendations: [
            gameDatabase['the witcher 3'],
            gameDatabase['minecraft'],
            gameDatabase['cyberpunk 2077']
          ],
          generalAdvice:
            '💡 **Gaming Tip**: Consider your preferred play style - story-driven RPGs, creative sandbox games, or action-packed adventures!'
        }
      }

      if (
        lowerQuery.includes('beginner') ||
        lowerQuery.includes('start') ||
        lowerQuery.includes('new')
      ) {
        return {
          id: Date.now(),
          type: 'ai',
          content:
            "🎮 **Gaming Tips for Beginners:**\n\n• Start with games that have good tutorials\n• Don't rush - take time to learn game mechanics\n• Join gaming communities for tips and support\n• Try different genres to find what you enjoy\n• Consider co-op games to play with friends",
          suggestions: [
            'What are easy games for beginners?',
            'How to improve gaming skills?',
            'Best gaming platforms to start with'
          ]
        }
      }

      if (lowerQuery.includes('rpg') || lowerQuery.includes('role playing')) {
        return {
          id: Date.now(),
          type: 'ai',
          content:
            "🏰 **RPG Games Guide:**\n\nRPGs (Role-Playing Games) let you create characters, make choices that affect the story, and develop skills over time. They're perfect for immersive storytelling experiences.",
          generalAdvice:
            'Popular RPG sub-genres include: Action RPGs, Turn-based RPGs, JRPGs, and MMORPGs. Each offers different gameplay styles!',
          suggestions: [
            'What makes a good RPG?',
            'Single-player vs multiplayer RPGs',
            'RPG character building tips'
          ]
        }
      }

      return {
        id: Date.now(),
        type: 'ai',
        content:
          "💬 I'm in General Q&A mode! Ask me anything about gaming - tips, recommendations, reviews, or general gaming advice:",
        suggestions: [
          'What are the best RPG games?',
          'Gaming tips for beginners',
          'How to choose the right game?',
          'Latest gaming trends'
        ]
      }
    }

    // No mode selected - show mode options again
    return {
      id: Date.now(),
      type: 'ai',
      content: "Please choose how you'd like me to help you:",
      promptOptions: [
        {
          title: '💬 Ask Me Anything',
          description:
            'General questions about games, recommendations, reviews, or gaming advice',
          examples: [
            'What are the best RPG games?',
            'Gaming tips for beginners',
            'Game reviews and ratings'
          ]
        },
        {
          title: '🔍 Search Our Platform',
          description:
            'Find specific games available on our platform and get detailed information',
          examples: [
            'Search for Minecraft',
            'Is Cyberpunk 2077 available?',
            'Show me platform exclusives'
          ]
        }
      ]
    }
  }

  const handleModeSelection = mode => {
    setCurrentMode(mode)
    const modeMessage = {
      id: Date.now(),
      type: 'ai',
      content:
        mode === 'general'
          ? "🎯 **General Q&A Mode Activated!**\n\nI'm now ready to answer questions about ANY game from anywhere! You can ask me about:\n• Game reviews and ratings\n• Gaming recommendations\n• Tips and strategies\n• Game comparisons\n• Industry news and trends\n\n💡 **Pro Tip**: Feel free to ask about games even if they're not on our platform!"
          : "🎯 **Platform Search Mode Activated!**\n\nI'm now focused on OUR platform's catalog! I can help you:\n• Check if specific games are available here\n• Browse our game collection\n• Get platform-specific pricing\n• Find platform exclusives\n• See availability status\n\n💡 **Pro Tip**: Ask 'Is [Game Name] available?' for quick availability checks!",
      suggestions:
        mode === 'general'
          ? [
              "Tell me about Baldur's Gate 3",
              'Best indie games of 2024',
              'How to improve at strategy games',
              'What makes a good RPG?'
            ]
          : [
              'Is Minecraft available on your platform?',
              'Show me all available RPG games',
              "What's trending on your platform?",
              'Browse your catalog'
            ]
    }
    setMessages(prev => [...prev, modeMessage])
  }

  const handleSuggestionClick = suggestion => {
    setInputValue(suggestion)
  }

  const GameCard = ({ game }) => (
    <div className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 max-w-md'>
      <div className='flex items-start space-x-4'>
        <img
          src={game.image}
          alt={game.name}
          className='w-20 h-20 rounded-xl object-cover shadow-lg'
        />
        <div className='flex-1'>
          <h4 className='font-bold text-lg text-gray-900 mb-2'>{game.name}</h4>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center space-x-2'>
              <Star className='h-4 w-4 text-yellow-500' />
              <span className='text-gray-700'>{game.rating}/5</span>
              <span className='text-gray-500'>•</span>
              <span className='text-gray-700'>{game.genre}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Calendar className='h-4 w-4 text-gray-500' />
              <span className='text-gray-700'>{game.releaseDate}</span>
              <span className='text-gray-500'>•</span>
              <Users className='h-4 w-4 text-gray-500' />
              <span className='text-gray-700 text-xs'>{game.players}</span>
            </div>
          </div>
        </div>
      </div>
      <p className='text-gray-600 text-sm mt-4 mb-4'>{game.description}</p>
      <div className='flex justify-between items-center'>
        <span className='text-2xl font-bold text-indigo-600'>{game.price}</span>
        <button className='px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm'>
          View Details
        </button>
      </div>
    </div>
  )

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-2xl border border-gray-100'>
      {/* Header */}
      <div className='flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100'>
        <div className='p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl'>
          <Bot className='h-8 w-8 text-white' />
        </div>
        <div className='flex-1'>
          <h2 className='text-3xl font-bold text-gray-900'>
            AI Game Assistant
          </h2>
          <p className='text-gray-600 mt-1'>
            {currentMode === 'general'
              ? 'General Gaming Q&A Mode'
              : currentMode === 'platform'
              ? 'Platform Search Mode'
              : 'Choose your assistance mode below'}
          </p>
        </div>
        <div className='flex items-center space-x-4'>
          {currentMode && (
            <button
              onClick={() => setCurrentMode(null)}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium'
            >
              Switch Mode
            </button>
          )}
          <div className='flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
            <span className='text-green-700 text-sm font-medium'>Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className='h-96 overflow-y-auto mb-6 space-y-6 pr-2'>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex space-x-3 max-w-3xl ${
                message.type === 'user'
                  ? 'flex-row-reverse space-x-reverse'
                  : ''
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                }`}
              >
                {message.type === 'user' ? (
                  <User className='h-5 w-5 text-white' />
                ) : (
                  <Bot className='h-5 w-5 text-white' />
                )}
              </div>
              <div
                className={`flex-1 ${
                  message.type === 'user' ? 'text-right' : ''
                }`}
              >
                <div
                  className={`inline-block p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                >
                  <p className='whitespace-pre-wrap'>{message.content}</p>
                </div>

                {/* Navigation Guide */}
                {message.navigationGuide && (
                  <div className='mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100'>
                    <div className='text-center mb-8'>
                      <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                        {message.navigationGuide.title}
                      </h3>
                      <p className='text-gray-700'>
                        {message.navigationGuide.description}
                      </p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      {message.navigationGuide.routes.map((route, index) => (
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
                                <p
                                  key={useCaseIndex}
                                  className='text-sm text-gray-600'
                                >
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

                    <div className='mt-8 text-center'>
                      <div className='inline-flex items-center space-x-2 bg-yellow-100 px-6 py-3 rounded-full border border-yellow-200'>
                        <span className='text-yellow-600'>⚡</span>
                        <span className='text-yellow-800 font-medium text-sm'>
                          Choose your preferred approach below to get started!
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prompt Options */}
                {message.promptOptions && (
                  <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {message.promptOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleModeSelection(
                            index === 0 ? 'general' : 'platform'
                          )
                        }
                        className={`bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-${option.color}-300 hover:shadow-xl transition-all cursor-pointer group transform hover:-translate-y-1`}
                      >
                        <div className='text-center'>
                          <div
                            className={`inline-flex p-4 bg-gradient-to-r from-${option.color}-100 to-${option.color}-200 rounded-2xl mb-4 group-hover:from-${option.color}-200 group-hover:to-${option.color}-300 transition-all`}
                          >
                            {index === 0 ? (
                              <Bot
                                className={`h-8 w-8 text-${option.color}-600`}
                              />
                            ) : (
                              <Search
                                className={`h-8 w-8 text-${option.color}-600`}
                              />
                            )}
                          </div>
                          <h4 className='font-bold text-2xl text-gray-900 mb-3'>
                            {option.title}
                          </h4>
                          <p className='text-gray-600 mb-6'>
                            {option.description}
                          </p>
                          <div
                            className={`inline-flex px-8 py-3 bg-gradient-to-r from-${option.color}-600 to-${option.color}-700 text-white rounded-xl font-semibold group-hover:from-${option.color}-700 group-hover:to-${option.color}-800 transition-all shadow-lg hover:shadow-xl`}
                          >
                            {option.buttonText}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Game Info Card */}
                {message.gameInfo && (
                  <div className='mt-4'>
                    <GameCard game={message.gameInfo} />
                  </div>
                )}

                {/* General Advice */}
                {message.generalAdvice && (
                  <div className='mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl'>
                    <p className='text-gray-700 text-sm'>
                      {message.generalAdvice}
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                {message.recommendations && (
                  <div className='mt-4 space-y-4'>
                    {message.recommendations.map((game, index) => (
                      <GameCard key={index} game={game} />
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && (
                  <div className='mt-4 space-y-2'>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className='block w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all text-sm'
                      >
                        <div className='flex items-center space-x-2'>
                          <Sparkles className='h-4 w-4 text-indigo-500' />
                          <span className='text-gray-700'>{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className='flex justify-start'>
            <div className='flex space-x-3 max-w-3xl'>
              <div className='flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center'>
                <Bot className='h-5 w-5 text-white' />
              </div>
              <div className='bg-gray-50 p-4 rounded-2xl'>
                <div className='flex space-x-2'>
                  <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='relative'>
        <div className='flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-300 focus-within:bg-white transition-all'>
          <Search className='h-5 w-5 text-gray-500' />
          <input
            type='text'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder='Ask me about games, search for specific titles, or get recommendations...'
            className='flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500'
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className='p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Send className='h-5 w-5' />
          </button>
        </div>

        {/* Quick Actions */}
        <div className='flex flex-wrap gap-2 mt-4'>
          {currentMode === 'general'
            ? [
                "Tell me about Baldur's Gate 3",
                'Best indie games 2024',
                'How to improve at FPS?',
                'What makes a good RPG?'
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(action)}
                  className='px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all'
                >
                  {action}
                </button>
              ))
            : currentMode === 'platform'
            ? [
                'Is Minecraft available?',
                'Show me RPG games',
                "What's trending here?",
                'Browse catalog'
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(action)}
                  className='px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all'
                >
                  {action}
                </button>
              ))
            : ['💬 Ask About ANY Game', '🔍 Check Our Platform'].map(
                (action, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleModeSelection(index === 0 ? 'general' : 'platform')
                    }
                    className='px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all'
                  >
                    {action}
                  </button>
                )
              )}
        </div>
      </div>
    </div>
  )
}

export default AIGameSection

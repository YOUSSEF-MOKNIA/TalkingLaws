import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleReference from './ArticleReference';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parse chat ID from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatId = params.get('chat');
    if (chatId) {
      fetchChatSession(chatId);
    } else {
      setMessages([]);
      setActiveChat(null);
    }
  }, [location.search]);

  // Fetch specific chat session
  const fetchChatSession = async (chatId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/chat/history/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveChat(data);
        const formattedMessages = data.messages.map(msg => ({
          type: msg.role,
          content: msg.content,
          articles: msg.articles || [],
          timestamp: new Date().toISOString()
        }));
        setMessages(formattedMessages);
      } else {
        navigate('/app/chat');
      }
    } catch (error) {
      console.error('Error fetching chat session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto focus input when empty
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: input,
          chat_id: activeChat?.id
        })
      });
      const data = await response.json();
      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        articles: data.articles || data.top_articles || [],
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      if (!activeChat && data.chat_id) {
        navigate(`/app/chat?chat=${data.chat_id}`);
        setActiveChat({ id: data.chat_id });
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "Je suis désolé, une erreur s'est produite. Veuillez réessayer.",
        articles: [],
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      setShowNewChatModal(true);
    } else {
      navigate('/app/chat');
    }
  };

  const confirmNewChat = () => {
    setMessages([]);
    setActiveChat(null);
    navigate('/app/chat');
    setShowNewChatModal(false);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Main Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative h-full flex flex-col bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
        style={{
          borderRadius: isMobile ? '0' : '24px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(248,250,252,0.3) 50%, rgba(243,244,246,0.4) 100%)'
        }}
      >
        {/* Enhanced Header */}
        <div className="relative bg-white/60 backdrop-blur-md border-b border-white/30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </motion.div>
              
              <div className="min-w-0">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  {activeChat ? activeChat.title || 'Conversation Juridique' : 'Assistant Juridique IA'}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 mt-1"
                >
                  {activeChat ? (
                    `Créée le ${new Date(activeChat.date || Date.now()).toLocaleDateString('fr-FR')}`
                  ) : (
                    'Spécialisé dans le droit marocain • Toujours à jour'
                  )}
                </motion.p>
              </div>
            </div>

            {activeChat && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewChat}
                className="group relative px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm"
              >
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{isMobile ? 'Nouveau' : 'Nouvelle conversation'}</span>
                </div>
              </motion.button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-8 py-16"
              >
                {/* Hero Section */}
                <div className="relative">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1] 
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="w-24 h-24 mx-auto mb-8 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                      <div className="flex items-center justify-center h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-4"
                  >
                    Comment puis-je vous aider ?
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                  >
                    Je suis votre assistant juridique alimenté par l'intelligence artificielle, 
                    spécialisé dans la législation marocaine. Posez-moi vos questions juridiques 
                    et obtenez des réponses précises et fiables.
                  </motion.p>
                </div>

                Quick Actions
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Questions populaires
                  </h3>
                  
                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} max-w-4xl mx-auto`}>
                    {[
                      {
                        icon: "👨‍⚖️",
                        title: "Divorce au Maroc",
                        question: "Quelles sont les conditions du divorce selon la loi marocaine ?",
                        color: "from-blue-500 to-blue-600"
                      },
                      {
                        icon: "🏢",
                        title: "Création d'entreprise",
                        question: "Comment créer une entreprise au Maroc ?",
                        color: "from-emerald-500 to-emerald-600"
                      },
                      {
                        icon: "🏠",
                        title: "Droits du locataire",
                        question: "Quels sont mes droits en tant que locataire au Maroc ?",
                        color: "from-amber-500 to-amber-600"
                      }
                    ].map((item, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickQuestion(item.question)}
                        className="group relative p-6 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        <div className="relative">
                          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-purple-700 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.question}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div> 
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-br from-gray-600 to-gray-700' 
                            : 'bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600'
                        }`}
                      >
                        {message.type === 'user' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        )}
                      </motion.div>

                      {/* Message Content */}
                      <div className="flex-1">
                        {/* Label */}
                        {message.type === 'assistant' && (
                          <div className="flex items-center mb-2">
                            <span className="text-xs font-semibold text-gray-500">Assistant Juridique</span>
                            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                              IA
                            </span>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className={`relative p-4 rounded-2xl shadow-lg ${
                            message.type === 'user' 
                              ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white' 
                              : 'bg-white/80 backdrop-blur-sm border border-white/40'
                          }`}
                        >
                          {/* Message gradient overlay for assistant */}
                          {message.type === 'assistant' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/30 rounded-2xl"></div>
                          )}
                          
                          <div className="relative">
                            <div className={`text-base leading-relaxed ${
                              message.type === 'user' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {message.content}
                            </div>
                          </div>
                        </motion.div>

                        {/* Timestamp */}
                        <div className={`text-xs text-gray-400 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                          {formatTime(message.timestamp)}
                        </div>

                        {/* Article References */}
                        {message.type === 'assistant' && message.articles && message.articles.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6"
                          >
                            <div className="flex items-center mb-4">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <h4 className="text-sm font-bold text-gray-700">Sources juridiques</h4>
                            </div>
                            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                              {message.articles.map((article, artIndex) => (
                                <ArticleReference key={artIndex} article={article} />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scale: [0.8, 1.4, 0.8],
                              opacity: [0.5, 1, 0.5] 
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                            className="h-2.5 w-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        L'assistant réfléchit...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="relative bg-white/60 backdrop-blur-md border-t border-white/30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative p-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="relative">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="relative"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Posez votre question juridique..."
                    className="w-full pl-6 pr-16 py-4 bg-white/80 backdrop-blur-sm border-2 border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-300 text-gray-800 shadow-lg text-base transition-all duration-300 placeholder-gray-500"
                    disabled={isLoading}
                  />
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all duration-300 ${
                      isLoading || !input.trim()
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isLoading ? (
                      <motion.svg 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </motion.svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </motion.button>
                </motion.div>
              </div>
              
              {/* Footer Info */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mt-4 text-xs text-gray-500"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium text-purple-600">
                    Basé sur la législation marocaine officielle
                  </span>
                </div>
                {!isMobile && (
                  <div className="hidden sm:flex items-center space-x-2 text-gray-400">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono shadow-sm">
                      Entrée
                    </kbd>
                    <span>pour envoyer</span>
                  </div>
                )}
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/30"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Nouvelle conversation</h3>
                </div>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Êtes-vous sûr de vouloir commencer une nouvelle conversation ? 
                  La conversation actuelle sera sauvegardée dans votre historique.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNewChatModal(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmNewChat}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  >
                    Nouvelle conversation
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatInterface;
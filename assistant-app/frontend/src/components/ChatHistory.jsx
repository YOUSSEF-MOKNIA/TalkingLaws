import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function ChatHistory({ fullWidth = false }) {
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatName, setNewChatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const renameInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  // Extract active chat ID from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatId = params.get('chat');
    setActiveChatId(chatId);
  }, [location.search]);
  
  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/chat/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }
        
        const data = await response.json();
        const processedData = data.map(chat => ({
          ...chat,
          message_count: chat.messages?.length || 0
        }));
        
        const sortedSessions = processedData.sort((a, b) => {
          return new Date(b.date || 0) - new Date(a.date || 0);
        });
        
        setChatSessions(sortedSessions);
        setError(null);
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError('Unable to load chat history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, []);
  
  // Filter chats based on search term
  const filteredChats = chatSessions.filter(chat => {
    const title = chat.title || 'Nouvelle conversation';
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Handle chat selection
  const handleChatClick = (chatId) => {
    navigate(`/app/chat?chat=${chatId}`);
  };
  
  // Handle delete chat action
  const openDeleteModal = (chat, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChat(chat);
    setShowDeleteModal(true);
  };
  
  // Handle rename chat action
  const openRenameModal = (chat, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChat(chat);
    setNewChatName(chat.title || '');
    setShowRenameModal(true);
    setTimeout(() => {
      renameInputRef.current?.focus();
    }, 100);
  };
  
  // Delete chat
  const deleteChat = async () => {
    if (!selectedChat) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/chat/history/${selectedChat.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }
      
      setChatSessions(prev => prev.filter(chat => chat.id !== selectedChat.id));
      
      if (activeChatId === selectedChat.id) {
        navigate('/app/chat');
      }
      
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting chat:', err);
      alert('Failed to delete chat. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Rename chat
  const renameChat = async (e) => {
    e.preventDefault();
    if (!selectedChat || !newChatName.trim()) return;
    
    try {
      setIsSubmitting(true);
      const token = localStorage.getEntity('token');
      const response = await fetch(`http://localhost:8000/chat/history/${selectedChat.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newChatName.trim()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to rename chat');
      }
      
      setChatSessions(prev => prev.map(chat => 
        chat.id === selectedChat.id ? { ...chat, title: newChatName.trim() } : chat
      ));
      
      setShowRenameModal(false);
    } catch (err) {
      console.error('Error renaming chat:', err);
      alert('Failed to rename chat. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return "Aujourd'hui";
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    
    const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'long' });
    }
    
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    }
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  // Group chats by date
  const groupChatsByDate = (chats) => {
    const groups = {};
    
    chats.forEach(chat => {
      const dateLabel = formatDate(chat.date);
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(chat);
    });
    
    return Object.entries(groups);
  };
  
  const handleSearchFocus = () => {
    searchInputRef.current?.select();
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };
  
  // Escape key to close modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowDeleteModal(false);
        setShowRenameModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Truncate chat title
  const truncateTitle = (title, maxLength = 28) => {
    if (!title || title.length <= maxLength) return title || 'Nouvelle conversation';
    return title.substring(0, maxLength) + '...';
  };
  
  // Get message count safely
  const getMessageCount = (chat) => {
    if (typeof chat.message_count === 'number') {
      return chat.message_count;
    }
    
    if (Array.isArray(chat.messages)) {
      return chat.messages.length;
    }
    
    return 0;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`h-full flex flex-col bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/60 overflow-hidden ${fullWidth ? 'w-full' : ''}`}
    >
      {/* Enhanced Header with Glass Effect */}
      <div className="flex-shrink-0 p-6 border-b border-white/40 bg-gradient-to-r from-white/90 via-purple-50/70 to-indigo-50/60 backdrop-blur-xl">
        <div className="flex items-center mb-5">
          <motion.div 
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 flex items-center justify-center mr-4 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Historique
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {filteredChats.length} conversation{filteredChats.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="relative group">
          <motion.input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder="Rechercher une conversation..."
            whileFocus={{ scale: 1.01 }}
            className="w-full py-3.5 pl-12 pr-12 bg-white/80 border-2 border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-300 text-gray-700 text-sm transition-all duration-300 shadow-lg placeholder-gray-400 backdrop-blur-sm group-hover:shadow-xl"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 group-focus-within:text-purple-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors p-1 rounded-full hover:bg-purple-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Scrollable Chat List Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent hover:scrollbar-thumb-purple-300"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#e9d5ff transparent'
        }}
      >
        <div className="p-4 pb-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mb-6 rounded-full border-4 border-purple-200 border-t-purple-600 shadow-lg"
              />
              <div className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Chargement des conversations...
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-6 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <div className="text-center mb-6 font-semibold text-gray-700 text-lg">{error}</div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 text-sm font-semibold shadow-xl hover:shadow-2xl"
              >
                Réessayer
              </motion.button>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-6">
              {searchTerm ? (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </motion.div>
                  <div className="text-center mb-3 font-semibold text-gray-700 text-lg">Aucune conversation trouvée</div>
                  <div className="text-center mb-6 text-sm text-gray-500">pour "{searchTerm}"</div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    className="px-6 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 text-sm font-medium shadow-lg"
                  >
                    Effacer la recherche
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-6 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </motion.div>
                  <div className="text-center mb-3 font-semibold text-gray-700 text-lg">Aucune conversation</div>
                  <div className="text-center mb-6 text-sm text-gray-500">Commencez votre première conversation</div>
                  <Link
                    to="/app/chat"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-2xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 text-sm font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                  >
                    Commencer une conversation
                  </Link>
                </>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {groupChatsByDate(filteredChats).map(([dateGroup, chats], groupIndex) => (
                <motion.div 
                  key={dateGroup}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
                >
                  {/* Enhanced Date Header */}
                  <div className="flex items-center mb-4 px-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 mr-3 shadow-sm"></div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gradient-to-r from-gray-500 to-gray-700 bg-clip-text text-transparent">
                      {dateGroup}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 via-transparent to-transparent ml-4"></div>
                  </div>
                  
                  {/* Chat Items */}
                  <div className="space-y-3">
                    {chats.map((chat, chatIndex) => {
                      const messageCount = getMessageCount(chat);
                      
                      return (
                        <motion.div
                          key={chat.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: chatIndex * 0.05 }}
                          whileHover={{ x: 8, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChatClick(chat.id)}
                          className={`group relative flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                            chat.id === activeChatId 
                              ? 'bg-gradient-to-r from-purple-100/80 via-purple-50/90 to-indigo-100/80 border-2 border-purple-300/60 shadow-xl backdrop-blur-sm' 
                              : 'bg-white/60 hover:bg-white/90 border-2 border-white/40 hover:border-purple-200/60 shadow-lg hover:shadow-xl backdrop-blur-sm'
                          }`}
                        >
                          {/* Enhanced Chat Icon */}
                          <motion.div 
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg ${
                              chat.id === activeChatId 
                                ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white shadow-purple-200' 
                                : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 group-hover:from-purple-100 group-hover:to-purple-200 group-hover:text-purple-600'
                            }`}
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </motion.div>
                          
                          {/* Chat Content */}
                          <div className="ml-4 min-w-0 flex-1">
                            <div className={`font-semibold text-sm truncate leading-tight ${
                              chat.id === activeChatId ? 'text-purple-900' : 'text-gray-800'
                            }`}>
                              {truncateTitle(chat.title)}
                            </div>
                            <div className="flex items-center mt-2 space-x-3">
                              <div className="flex items-center text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {messageCount} message{messageCount !== 1 ? 's' : ''}
                              </div>
                              {chat.id === activeChatId && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="px-2 py-1 bg-purple-200/60 text-purple-700 text-xs font-semibold rounded-full shadow-sm"
                                >
                                  Actuelle
                                </motion.div>
                              )}
                            </div>
                          </div>
                          
                          {/* Enhanced Action Buttons */}
                          <div className={`flex items-center space-x-2 transition-all duration-300 ${
                            chat.id === activeChatId ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                          }`}>
                            <motion.button
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => openRenameModal(chat, e)}
                              className="p-2.5 rounded-xl bg-white/80 hover:bg-purple-100 text-gray-400 hover:text-purple-700 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/60"
                              aria-label="Rename chat"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15, rotate: -5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => openDeleteModal(chat, e)}
                              className="p-2.5 rounded-xl bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/60"
                              aria-label="Delete chat"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          </div>
                          
                          {/* Hover Effect Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Enhanced Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden border border-white/60"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mr-5 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Supprimer la conversation
                </h3>
              </div>
              
              <p className="text-gray-600 mb-8 leading-relaxed text-base">
                Êtes-vous sûr de vouloir supprimer définitivement la conversation 
                <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg mx-1 text-sm">
                  "{truncateTitle(selectedChat?.title)}"
                </span> ? 
                Cette action est irréversible.
              </p>
              
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg"
                  disabled={isSubmitting}
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteChat}
                  className={`px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl transition-all duration-200 shadow-xl ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-900 hover:shadow-2xl'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Suppression...
                    </div>
                  ) : (
                    'Supprimer'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Rename Modal */}
      <AnimatePresence>
        {showRenameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden border border-white/60"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600"></div>
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mr-5 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Renommer la conversation
                </h3>
              </div>
              
              <form onSubmit={renameChat} className="space-y-6">
                <div>
                  <label htmlFor="new-chat-name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Nouveau nom de conversation
                  </label>
                  <motion.input
                    ref={renameInputRef}
                    type="text"
                    id="new-chat-name"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    placeholder="Nom de la conversation..."
                    whileFocus={{ scale: 1.01 }}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200/50 focus:border-purple-400 text-gray-700 bg-white/80 backdrop-blur-sm transition-all duration-300 text-base shadow-lg"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRenameModal(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl transition-all duration-200 shadow-xl ${
                      isSubmitting || !newChatName.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:from-purple-700 hover:to-indigo-800 hover:shadow-2xl'
                    }`}
                    disabled={isSubmitting || !newChatName.trim()}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Renommage...
                      </div>
                    ) : (
                      'Renommer'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e9d5ff;
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #d8b4fe;
        }
      `}</style>
    </motion.div>
  );
}

export default ChatHistory;
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
        
        // Process the data to ensure message_count exists for each chat
        const processedData = data.map(chat => ({
          ...chat,
          // Calculate message count from the messages array if it exists
          message_count: chat.messages?.length || 0
        }));
        
        // Sort by date, newest first
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
    navigate(`/?chat=${chatId}`);
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
    
    // Focus the input after modal is shown
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
      
      // Remove chat from state
      setChatSessions(prev => prev.filter(chat => chat.id !== selectedChat.id));
      
      // If the active chat was deleted, redirect to home
      if (activeChatId === selectedChat.id) {
        navigate('/');
      }
      
      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting chat:', err);
      // Show error in modal
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
      const token = localStorage.getItem('token');
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
      
      // Update chat in state
      setChatSessions(prev => prev.map(chat => 
        chat.id === selectedChat.id ? { ...chat, title: newChatName.trim() } : chat
      ));
      
      // Close modal
      setShowRenameModal(false);
    } catch (err) {
      console.error('Error renaming chat:', err);
      // Show error in modal
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
    
    // Same day
    if (date.toDateString() === now.toDateString()) {
      return "Aujourd'hui";
    }
    
    // Yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }
    
    // This week (last 7 days)
    const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'long' });
    }
    
    // This year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    }
    
    // Different year
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
  const truncateTitle = (title, maxLength = 25) => {
    if (!title || title.length <= maxLength) return title || 'Nouvelle conversation';
    return title.substring(0, maxLength) + '...';
  };
  
  // Get message count safely
  const getMessageCount = (chat) => {
    // First check if message_count is already calculated
    if (typeof chat.message_count === 'number') {
      return chat.message_count;
    }
    
    // Otherwise check the messages array
    if (Array.isArray(chat.messages)) {
      return chat.messages.length;
    }
    
    // Default to 0
    return 0;
  };
  
  return (
    <div className={`h-full flex flex-col bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden ${fullWidth ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-purple-100 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Historique des conversations</h2>
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder="Rechercher une conversation..."
            className="w-full py-2.5 pl-10 pr-10 bg-gray-50 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-700 text-sm"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-10 h-10 mb-3 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
            </div>
            <div className="text-sm">Chargement des conversations...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-center mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Réessayer
            </button>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            {searchTerm ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="text-center mb-2">Aucune conversation trouvée pour "{searchTerm}"</div>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Effacer la recherche
                </button>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div className="text-center mb-2">Vous n'avez pas encore de conversations</div>
                <Link
                  to="/"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Commencer une conversation
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {groupChatsByDate(filteredChats).map(([dateGroup, chats]) => (
              <div key={dateGroup}>
                <h3 className="text-xs font-medium text-gray-500 px-2 mb-2">{dateGroup}</h3>
                <div className="space-y-1">
                  {chats.map(chat => {
                    // Get message count using our helper function
                    const messageCount = getMessageCount(chat);
                    
                    return (
                      <motion.div
                        key={chat.id}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChatClick(chat.id)}
                        className={`relative flex items-center p-3 rounded-lg cursor-pointer group ${
                          chat.id === activeChatId 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'hover:bg-purple-50 text-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          chat.id === activeChatId 
                            ? 'bg-purple-200 text-purple-700' 
                            : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                          <div className={`font-medium text-sm truncate ${
                            chat.id === activeChatId ? 'text-purple-800' : 'text-gray-800'
                          }`}>
                            {truncateTitle(chat.title)}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {messageCount} message{messageCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                        
                        {/* Action buttons - visible on hover or when active */}
                        <div className={`flex space-x-1 ${chat.id === activeChatId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                          <button
                            onClick={(e) => openRenameModal(chat, e)}
                            className="p-1.5 rounded-md hover:bg-purple-200 text-gray-500 hover:text-purple-700 transition-colors"
                            aria-label="Rename chat"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => openDeleteModal(chat, e)}
                            className="p-1.5 rounded-md hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                            aria-label="Delete chat"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-red-500"></div>
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Supprimer la conversation</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer définitivement la conversation "{truncateTitle(selectedChat?.title)}" ? Cette action est irréversible.
              </p>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={deleteChat}
                  className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
      
      {/* Rename modal */}
      <AnimatePresence>
        {showRenameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-purple-500"></div>
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Renommer la conversation</h3>
              </div>
              
              <form onSubmit={renameChat} className="space-y-5">
                <div>
                  <label htmlFor="new-chat-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nouveau nom
                  </label>
                  <input
                    ref={renameInputRef}
                    type="text"
                    id="new-chat-name"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    placeholder="Nom de la conversation"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-gray-700 bg-white"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowRenameModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg transition-colors ${
                      isSubmitting || !newChatName.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
                    }`}
                    disabled={isSubmitting || !newChatName.trim()}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
    </div>
  );
}

export default ChatHistory;
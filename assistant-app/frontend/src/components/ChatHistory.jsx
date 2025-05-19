import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ChatHistory({ fullWidth = false }) {
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  
  // Get current chat id from URL
  const currentChatId = new URLSearchParams(location.search).get('chat');
  
  useEffect(() => {
    // Close the menu when clicking outside
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/chat/history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setChatSessions(data);
        } else {
          console.error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, []);
  
  const handleChatClick = (chatId) => {
    navigate(`/?chat=${chatId}`);
  };
  
  const handleRenameChat = async (e, chatId, currentTitle) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const newTitle = prompt('Entrez un nouveau titre:', currentTitle);
    if (newTitle && newTitle !== currentTitle) {
      try {
        const response = await fetch(`http://localhost:8000/chat/history/${chatId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ title: newTitle })
        });
        
        if (response.ok) {
          // Update local state
          setChatSessions(prev => 
            prev.map(chat => chat.id === chatId ? {...chat, title: newTitle} : chat)
          );
        }
      } catch (error) {
        console.error('Error renaming chat:', error);
      }
    }
  };
  
  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conversation?')) {
      try {
        const response = await fetch(`http://localhost:8000/chat/history/${chatId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          // Remove from local state
          setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
          // If the deleted chat is the active one, navigate back to home
          if (currentChatId === chatId) {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    }
  };

  const clearAllChats = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les conversations?')) {
      try {
        const response = await fetch('http://localhost:8000/chat/history', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          setChatSessions([]);
          navigate('/');
        }
      } catch (error) {
        console.error('Error deleting all chats:', error);
      }
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <div className={`h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 ${
      fullWidth ? 'max-w-4xl mx-auto' : ''
    }`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Conversations récentes</h2>
          {chatSessions.length > 0 && (
            <button
              onClick={clearAllChats}
              className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              Tout effacer
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : chatSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-center">Aucune conversation</p>
            <p className="text-sm text-gray-400 text-center mt-1">
              Vos conversations apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {chatSessions.map(chat => (
              <div 
                key={chat.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  currentChatId === chat.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                }`}
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="mr-2">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDate(chat.date)}
                      </div>
                      <div className="font-medium text-gray-800 truncate max-w-[180px]">
                        {chat.title}
                      </div>
                    </div>
                    
                    {/* Three dots menu */}
                    <div className="relative" ref={menuRef}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {activeMenuId === chat.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={(e) => handleRenameChat(e, chat.id, chat.title)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Renommer
                            </button>
                            <button
                              onClick={(e) => handleDeleteChat(e, chat.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Preview of first message */}
                  {chat.messages && chat.messages.length > 0 && (
                    <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {chat.messages[0].content}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {fullWidth && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Nouvelle conversation
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatHistory;
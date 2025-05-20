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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
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
        
        // Format messages for display
        const formattedMessages = data.messages.map(msg => ({
          type: msg.role,
          content: msg.content,
          articles: msg.articles || [],
          timestamp: new Date().toISOString() // Add timestamps for display
        }));
        
        setMessages(formattedMessages);
      } else {
        console.error('Failed to fetch chat session');
        navigate('/'); // Redirect if chat not found
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
    
    // Add user message with timestamp
    const userMessage = { 
      type: 'user', 
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call API to get response
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
      
      // Add assistant message with articles and timestamp
      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        articles: data.articles || data.top_articles || [],
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If this is a new chat, update the URL with the new chat ID
      if (!activeChat && data.chat_id) {
        navigate(`/?chat=${data.chat_id}`);
        setActiveChat({ id: data.chat_id });
      }
    } catch (error) {
      console.error('Error fetching response:', error);
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
      // If no messages, just reset without confirmation
      navigate('/');
    }
  };
  
  const confirmNewChat = () => {
    setMessages([]);
    setActiveChat(null);
    navigate('/');
    setShowNewChatModal(false);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    // Optional: auto-submit after a short delay
    // setTimeout(() => handleSubmit({ preventDefault: () => {} }), 500);
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMessageContent = (content) => {
    if (!content) return null;
    
    // Split by double newlines to create paragraphs
    const paragraphs = content.split(/\n\n+/);
    
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, i) => {
          // Check if this paragraph is a list
          if (paragraph.match(/^[•\-*]\s/m)) {
            // Split into list items
            const items = paragraph.split(/\n/).filter(item => item.trim());
            return (
              <ul key={i} className="list-disc pl-5 space-y-1.5">
                {items.map((item, j) => (
                  <li key={j} className="text-gray-800">
                    {item.replace(/^[•\-*]\s/, '')}
                  </li>
                ))}
              </ul>
            );
          } else if (paragraph.match(/^\d+\.\s/m)) {
            // Numbered list
            const items = paragraph.split(/\n/).filter(item => item.trim());
            return (
              <ol key={i} className="list-decimal pl-5 space-y-1.5">
                {items.map((item, j) => (
                  <li key={j} className="text-gray-800">
                    {item.replace(/^\d+\.\s/, '')}
                  </li>
                ))}
              </ol>
            );
          } else {
            // Regular paragraph with line breaks
            return (
              <p key={i} className="text-gray-800">
                {paragraph.split(/\n/).map((line, j) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < paragraph.split(/\n/).length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
          }
        })}
      </div>
    );
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden border border-purple-100"
    >
      <div className="p-4 md:p-5 border-b border-purple-100 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">
              {activeChat ? activeChat.title || 'Conversation' : 'Nouvelle conversation'}
            </h2>
            {activeChat && (
              <div className="text-xs text-gray-500 mt-0.5">
                {new Date(activeChat.date || Date.now()).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>
        </div>
        {activeChat && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewChat}
            className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nouvelle conversation
          </motion.button>
        )}
      </div>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#fcfaff]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Comment puis-je vous aider ?</h3>
            <p className="text-center text-gray-600 max-w-md mb-8">
              Posez-moi des questions juridiques et je vous répondrai en me basant sur la législation marocaine.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
              {[
                "Quelles sont les conditions du divorce selon la loi marocaine ?",
                "Comment créer une entreprise au Maroc ?",
                "Quels sont mes droits en tant que locataire au Maroc ?"
              ].map((question, index) => (
                <motion.button 
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  whileHover={{ y: -3, backgroundColor: "#f3e8ff" }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left p-4 bg-white hover:bg-purple-50 rounded-xl shadow-sm border border-purple-100 transition-all duration-200"
                >
                  <p className="font-medium text-gray-800 text-sm">{question}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
              >
                {/* Message content */}
                <div className={`max-w-[85%] flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  {message.type === 'assistant' && (
                    <div className="flex items-center mb-2 ml-14">
                      <div className="text-xs text-gray-500 font-medium">Assistant Juridique</div>
                      <div className="ml-2 px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-600">AI</div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    {/* Assistant avatar - only show on first assistant message or if previous message was from user */}
                    {message.type === 'assistant' && (index === 0 || messages[index-1].type === 'user') && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex-shrink-0 mr-4 flex items-center justify-center text-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* User avatar - only show on first user message or after assistant message */}
                    {message.type === 'user' && (index === 0 || messages[index-1].type === 'assistant') && (
                      <div className="order-2 w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 ml-4 flex items-center justify-center text-gray-500 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    <div 
                      className={`rounded-2xl p-4 shadow-sm ${
                        message.type === 'user' 
                          ? 'order-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white' 
                          : message.type === 'assistant' 
                            ? 'bg-white border border-purple-100' 
                            : 'bg-gray-200 text-gray-800'
                      } ${message.type === 'assistant' && (index === 0 || messages[index-1].type === 'user') ? '' : message.type === 'assistant' ? 'ml-14' : ''}`}
                    >
                      {message.type === 'user' ? (
                        <div className="whitespace-pre-wrap text-white">{message.content}</div>
                      ) : (
                        formatMessageContent(message.content)
                      )}
                    </div>
                  </div>
                  
                  {/* Timestamp for user messages */}
                  {message.type === 'user' && (
                    <div className="text-xs text-gray-500 mt-1 mr-14">
                      {message.timestamp ? formatTime(message.timestamp) : formatTime(new Date().toISOString())}
                    </div>
                  )}
                  
                  {/* Article references */}
                  {message.type === 'assistant' && message.articles && message.articles.length > 0 && (
                    <div className="mt-4 ml-14">
                      <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <h4 className="text-sm font-medium text-gray-800">Sources juridiques</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-2">
                        {message.articles.map((article, artIndex) => (
                          <ArticleReference key={artIndex} article={article} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex-shrink-0 mr-4 flex items-center justify-center text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="max-w-[85%] bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
              <div className="flex space-x-2.5">
                <motion.div
                  animate={{ 
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                  className="w-2 h-2 rounded-full bg-purple-400"
                />
                <motion.div
                  animate={{ 
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: "loop" }}
                  className="w-2 h-2 rounded-full bg-purple-400"
                />
                <motion.div
                  animate={{ 
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatType: "loop" }}
                  className="w-2 h-2 rounded-full bg-purple-400"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-purple-100 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question juridique..."
              className="w-full pl-4 pr-14 py-3.5 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-gray-800 shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg p-2 ${
                isLoading || !input.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm hover:from-purple-600 hover:to-purple-700'
              } transition-colors`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <div className="flex items-center text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Basé sur la législation marocaine officielle</span>
            </div>
            <div className="hidden sm:block">
              Appuyez sur <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Entrée</kbd> pour envoyer
            </div>
          </div>
        </form>
      </div>
      
      {/* New Chat confirmation modal */}
      <AnimatePresence>
        {showNewChatModal && (
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Nouvelle conversation</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir commencer une nouvelle conversation ? La conversation actuelle restera accessible dans votre historique.
              </p>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmNewChat}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Confirmer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ChatInterface;
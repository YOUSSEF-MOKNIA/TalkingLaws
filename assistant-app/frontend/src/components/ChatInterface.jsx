import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArticleReference from './ArticleReference';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const messagesEndRef = useRef(null);
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
          articles: msg.articles || []
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
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { type: 'user', content: input };
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
      
      // Add assistant message with articles
      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        articles: data.articles || data.top_articles || []
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
        articles: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = () => {
    if (messages.length > 0 && 
        !window.confirm('Êtes-vous sûr de vouloir commencer une nouvelle conversation ?')) {
      return;
    }
    setMessages([]);
    setActiveChat(null);
    navigate('/');
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">
              {activeChat ? activeChat.title : 'Nouvelle conversation'}
            </h2>
          </div>
        </div>
        {activeChat && (
          <button
            onClick={handleNewChat}
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nouvelle conversation
          </button>
        )}
      </div>
      
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Comment puis-je vous aider ?</h3>
            <p className="text-center text-gray-500 max-w-md mb-6">
              Posez-moi des questions juridiques et je vous répondrai en me basant sur la législation marocaine.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full max-w-md">
              <button 
                onClick={() => setInput("Quelles sont les conditions du divorce selon la loi marocaine ?")}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
              >
                <p className="font-medium text-gray-800">Quelles sont les conditions du divorce selon la loi marocaine ?</p>
              </button>
              <button 
                onClick={() => setInput("Comment créer une entreprise au Maroc ?")}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
              >
                <p className="font-medium text-gray-800">Comment créer une entreprise au Maroc ?</p>
              </button>
              <button 
                onClick={() => setInput("Quels sont mes droits en tant que locataire au Maroc ?")}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200"
              >
                <p className="font-medium text-gray-800">Quels sont mes droits en tant que locataire au Maroc ?</p>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {/* User avatar */}
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 ml-2 order-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              
              {/* Message content */}
              <div className={`max-w-[75%] ${message.type === 'user' ? 'order-0' : ''}`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.101-1.028A5.001 5.001 0 0010 7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Assistant Juridique</span>
                  </div>
                )}
                
                <div 
                  className={`rounded-2xl p-4 ${
                    message.type === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                
                {message.type === 'user' && (
                  <div className="flex justify-end mt-2">
                    <div className="text-xs text-gray-500">
                      Vous • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                )}
                
                {/* Article references */}
                {message.type === 'assistant' && message.articles && message.articles.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                      </svg>
                      <h4 className="text-sm font-medium text-gray-800">Sources juridiques</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto pb-2">
                      {message.articles.map((article, artIndex) => (
                        <ArticleReference key={artIndex} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.352-.035-.696-.101-1.028A5.001 5.001 0 0010 7z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600">Assistant Juridique</span>
            </div>
            <div className="max-w-[75%] bg-gray-100 rounded-2xl p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question juridique..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`rounded-full p-3 ${
              isLoading || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;
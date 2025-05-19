import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios"; // Make sure you have axios installed

export default function HistoryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [chatHistory, setChatHistoryState] = useState([]);
  const [error, setError] = useState(null);

  // Fetch chat history from the API
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token"); // Assuming you store token in localStorage
        const response = await axios.get("http://localhost:8000/chat/history", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChatHistoryState(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError("Failed to load chat history");
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const clearAllHistory = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tout l'historique des conversations ?")) {
      // Call the parent's setChatHistory function
      if (setChatHistory) {
        setChatHistory([]);
      }
      // Update local state
      setChatHistoryState([]);
    }
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = chatHistory.filter(item => item.id !== id);
    
    // Call the parent's setChatHistory function
    if (setChatHistory) {
      setChatHistory(updatedHistory);
    }
    // Update local state
    setChatHistoryState(updatedHistory);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50/40 to-purple-50/40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-50/40 to-purple-50/40">
      <div className="border-b border-purple-100 bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Historique des conversations</h1>
          <p className="text-gray-600 mt-1">Consultez vos conversations antérieures</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {chatHistory.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-8 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucune conversation</h2>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore de conversations enregistrées</p>
              <Link 
                to="/chat" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                Démarrer une conversation
              </Link>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-600">
                  {chatHistory.length} conversation{chatHistory.length !== 1 ? 's' : ''}
                </div>
                <button 
                  onClick={clearAllHistory}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Tout effacer
                </button>
              </div>
              
              <div className="space-y-4">
                {chatHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden"
                  >
                    <div className="p-4 md:p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            {formatDate(item.date)}
                          </div>
                          <h3 className="font-semibold text-gray-800">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex space-x-2">
                          <Link 
                            to="/chat" 
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </Link>
                          <button 
                            onClick={() => deleteHistoryItem(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-purple-100">
                        <div className="flex space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                          </div>
                          <div className="text-gray-700 text-sm line-clamp-2">
                            {item.messages && item.messages.length > 0 ? item.messages[0].content : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
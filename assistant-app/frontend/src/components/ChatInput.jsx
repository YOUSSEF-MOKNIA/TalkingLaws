a_PROJECTS\legal-rag-assistant\assistant-app\frontend\src\components\ChatInput.jsx
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChatInput({ value, onChange, onSend, isLoading, onNewChat }) {
  const textareaRef = useRef(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [value]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend(e);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-purple-100 transition-all duration-300 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-200 focus-within:shadow-md"
        >
          <form onSubmit={onSend} className="relative">
            <textarea
              ref={textareaRef}
              className="w-full px-5 py-4 pr-14 rounded-2xl resize-none bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
              placeholder="Posez votre question juridique..."
              rows={1}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={isLoading}
              onKeyDown={handleKeyDown}
              style={{ maxHeight: "120px", minHeight: "40px" }}
            />
            
            <motion.button
              type="submit"
              disabled={isLoading || !value.trim()}
              whileTap={{ scale: 0.95 }}
              className={`absolute right-3 bottom-3 rounded-lg p-2 transition-colors duration-300 ${
                value.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:from-purple-700 hover:to-indigo-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              )}
            </motion.button>
          </form>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-1 text-xs text-gray-500">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewChat}
            className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors mb-2 sm:mb-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Nouvelle conversation</span>
          </motion.button>
          
          <div className="flex flex-wrap gap-2 items-center">
            <div className="hidden sm:flex items-center space-x-1">
              <span className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs">Shift + Enter</span>
              <span>pour une nouvelle ligne</span>
            </div>
            <span className="text-xs text-purple-500 font-medium">JuriDOC - Législation marocaine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
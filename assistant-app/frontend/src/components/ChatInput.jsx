import React from "react";
import { motion } from "framer-motion";

export default function ChatInput({ value, onChange, onSend, isLoading, onNewChat }) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <form onSubmit={onSend} className="relative">
        <textarea
          className="w-full px-4 py-3 pr-20 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white text-gray-800 shadow-sm"
          placeholder="Posez votre question juridique..."
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          style={{ maxHeight: "120px" }}
        />
        
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className={`absolute right-2 bottom-3 rounded-lg p-2 ${
            value.trim() && !isLoading
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              : "bg-gray-200 text-gray-400"
          } transition-colors duration-200`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </form>
      
      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewChat}
          className="flex items-center space-x-1 hover:text-purple-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Nouvelle conversation</span>
        </motion.button>
        <span>JuriDOC utilise exclusivement le contenu juridique marocain pertinent.</span>
      </div>
    </div>
  );
}
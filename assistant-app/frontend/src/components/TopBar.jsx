// filepath: assistant-app/frontend/src/components/TopBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ isMobile, title, onMenuClick }) => {
  const { user } = useAuth();
  
  // Extract initials from full name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="relative h-16 px-6 flex items-center justify-between bg-white/95 backdrop-blur-xl border-b border-purple-100/60 shadow-sm">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-purple-50/20 to-white"></div>
      
      <div className="relative z-10 flex items-center w-full">
        {/* Mobile menu button */}
        {isMobile && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-25 hover:from-purple-100 hover:to-purple-50 flex items-center justify-center text-purple-600 hover:text-purple-700 transition-all duration-300 shadow-sm hover:shadow-md border border-purple-100/50 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}
        
        {/* Page title with enhanced styling */}
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          
          {/* Breadcrumb indicator */}
          <div className="hidden sm:flex items-center ml-4 text-xs text-purple-500/70">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">Tableau de bord</span>
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* User profile on mobile */}
          {isMobile && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-purple-700 font-bold text-sm shadow-sm border border-purple-100/50">
                {getInitials(user?.full_name)}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
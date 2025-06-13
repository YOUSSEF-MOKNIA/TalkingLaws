import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Navigation item component with modern styling
const NavItem = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group relative flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 ease-out ${
      active 
        ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 shadow-lg shadow-purple-100/50' 
        : 'text-gray-600 hover:bg-purple-50/70 hover:text-purple-700 hover:shadow-md hover:shadow-purple-100/30'
    }`}
  >
    {/* Active indicator */}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-500 rounded-r-full"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    
    <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl mr-4 transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-br from-purple-200 to-purple-100 text-purple-700 shadow-lg shadow-purple-200/50' 
        : 'bg-gray-100/80 text-gray-500 group-hover:bg-purple-100/70 group-hover:text-purple-600 group-hover:shadow-md'
    }`}>
      {/* Icon glow effect for active state */}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-xl blur-sm"></div>
      )}
      <div className="relative z-10">
        {icon}
      </div>
    </div>
    
    <span className="font-semibold text-sm tracking-wide">{label}</span>
    
    {/* Subtle arrow for active item */}
    {active && (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="ml-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    )}
  </Link>
);

const Sidebar = ({ isMobile, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Extract initials from full name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
  };
  
  // Sidebar animation variants
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div 
        className={`${isMobile ? 'fixed z-[60] h-full w-80' : 'relative w-72'} flex flex-col bg-white/95 backdrop-blur-xl border-r border-purple-100/60 ${
          isMobile ? 'shadow-2xl shadow-purple-900/10' : 'shadow-lg shadow-purple-100/30'
        }`}
        variants={isMobile ? sidebarVariants : {}}
        initial={isMobile ? 'closed' : 'open'}
        animate={isMobile ? (isOpen ? 'open' : 'closed') : 'open'}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 30
        }}
      >
        {/* Logo and header with gradient background */}
        <div className="relative p-6 border-b border-purple-100/60">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white"></div>
          
          <div className="relative flex items-center">
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-100/50">
              {/* Logo glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl blur-sm"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="relative z-10 w-7 h-7 text-purple-700">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="ml-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent">
                JuriDOC
              </h1>
              <p className="text-xs text-purple-600/70 font-medium mt-0.5">Assistant Juridique</p>
            </div>
            
            {/* Close button for mobile */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="ml-auto h-10 w-10 flex items-center justify-center rounded-xl bg-purple-50/70 hover:bg-purple-100/70 text-purple-500 hover:text-purple-600 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Navigation with improved spacing */}
        <nav className="flex-1 px-5 py-8 overflow-y-auto">
          <div className="space-y-3">
            <NavItem 
              to="/chat" 
              active={currentPath === '/chat'} 
              onClick={() => isMobile && onClose()}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              } 
              label="Assistant"
            />
            <NavItem 
              to="/codes" 
              active={currentPath.startsWith('/codes')} 
              onClick={() => isMobile && onClose()}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              } 
              label="Codes Juridiques"
            />
            <NavItem 
              to="/history" 
              active={currentPath === '/history'} 
              onClick={() => isMobile && onClose()}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } 
              label="Historique"
            />
          </div>
        </nav>
        
        {/* Enhanced user profile section */}
        <div className="relative p-5 border-t border-purple-100/60">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-white"></div>
          
          <motion.div 
            className="relative flex items-center p-4 rounded-2xl bg-gradient-to-r from-purple-50/50 to-purple-25/30 hover:from-purple-100/50 hover:to-purple-50/40 transition-all duration-300 border border-purple-100/50 hover:border-purple-200/60 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-purple-700 font-bold text-lg flex-shrink-0 shadow-lg shadow-purple-100/50">
              {/* Avatar glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl blur-sm"></div>
              <span className="relative z-10">{getInitials(user?.full_name)}</span>
            </div>
            
            <div className="ml-4 min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-800 truncate">{user?.full_name || 'Utilisateur'}</div>
              <div className="flex items-center text-xs text-purple-600/80 mt-1">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                En ligne
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="ml-3 p-2.5 rounded-xl bg-purple-100/70 hover:bg-purple-200/70 transition-all duration-200 flex-shrink-0 group shadow-sm hover:shadow-md"
              title="Déconnexion"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 group-hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
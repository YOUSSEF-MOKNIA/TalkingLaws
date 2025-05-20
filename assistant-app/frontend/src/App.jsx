import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import ChatHistory from './components/ChatHistory';
import CodesJuridiques from './components/CodesJuridiques';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Navigation item component with animation
const NavItem = ({ to, icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-purple-100 text-purple-800' 
        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
    }`}
  >
    <div className={`${collapsed ? 'w-10 h-10' : 'w-9 h-9'} flex items-center justify-center rounded-lg ${
      collapsed ? 'mx-auto' : 'mr-3'
    } transition-all duration-200 ${
      active ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600'
    }`}>
      {icon}
    </div>
    {!collapsed && <span className="font-medium truncate">{label}</span>}
  </Link>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          </div>
          <span className="mt-4 text-purple-800 font-medium">Chargement...</span>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function MainApp() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // On desktop, restore sidebar state from localStorage if available
      if (!mobile) {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
          setSidebarCollapsed(savedState === 'true');
        }
      } else {
        // On mobile, always collapse sidebar by default
        setSidebarCollapsed(true);
        setMobileSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    
    // Save preference for desktop
    if (!isMobile) {
      localStorage.setItem('sidebarCollapsed', newState.toString());
    }
  };
  
  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  // Close mobile sidebar when changing routes
  useEffect(() => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [location, isMobile]);
  
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
  
  // Sidebar variants for animations
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' },
    mobileOpen: { x: 0 },
    mobileClosed: { x: '-100%' }
  };
  
  // Current page title based on path
  const getPageTitle = () => {
    if (currentPath === '/' || currentPath === '/chat') return 'Assistant Juridique';
    if (currentPath === '/codes') return 'Codes Juridiques';
    if (currentPath === '/history') return 'Historique';
    if (currentPath.startsWith('/codes/')) return 'Article Juridique';
    return 'JuriDOC';
  };
  
  return (
    <div className="flex h-screen bg-purple-50 overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && mobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-30 z-20"
            onClick={toggleMobileSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div 
        className={`${isMobile ? 'fixed z-30 h-full' : 'relative'} flex flex-col bg-white border-r border-purple-100 ${
          isMobile ? 'shadow-xl' : ''
        }`}
        variants={sidebarVariants}
        initial={isMobile ? 'mobileClosed' : 'expanded'}
        animate={
          isMobile 
            ? mobileSidebarOpen ? 'mobileOpen' : 'mobileClosed'
            : sidebarCollapsed ? 'collapsed' : 'expanded'
        }
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30
        }}
      >
        {/* Logo area */}
        <div className={`p-4 flex items-center ${sidebarCollapsed && !isMobile ? 'justify-center' : 'px-6'} border-b border-purple-100`}>
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-700">
              <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          
          {(!sidebarCollapsed || isMobile) && (
            <span className="ml-3 text-xl font-bold text-purple-800">JuriDOC</span>
          )}
          
          <div className="ml-auto">
            {/* Sidebar toggle button - shown only on desktop */}
            {!isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-purple-100 text-purple-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  {sidebarCollapsed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  )}
                </svg>
              </motion.button>
            )}
            
            {/* Close sidebar button - mobile only */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileSidebar}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-purple-100 text-purple-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Page title - visible on mobile */}
        {isMobile && (
          <div className="px-6 py-4 border-b border-purple-100">
            <h1 className="text-lg font-semibold text-purple-800">{getPageTitle()}</h1>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-2">
            <NavItem 
              to="/" 
              active={currentPath === '/' || currentPath === '/chat'} 
              collapsed={sidebarCollapsed && !isMobile}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              } 
              label="Assistant"
            />
            <NavItem 
              to="/codes" 
              active={currentPath.startsWith('/codes')} 
              collapsed={sidebarCollapsed && !isMobile}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              } 
              label="Codes Juridiques"
            />
            <NavItem 
              to="/history" 
              active={currentPath === '/history'} 
              collapsed={sidebarCollapsed && !isMobile}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } 
              label="Historique"
            />
          </div>
        </nav>
        
        {/* User area */}
        <div className={`p-4 border-t border-purple-100 ${sidebarCollapsed && !isMobile ? 'flex justify-center' : ''}`}>
          {sidebarCollapsed && !isMobile ? (
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold cursor-pointer"
              >
                {getInitials(user?.full_name)}
              </motion.div>
              
              {/* Tooltip on hover */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white text-gray-800 rounded-lg shadow-lg text-sm whitespace-nowrap z-10 border border-purple-100">
                <div className="font-medium">{user?.full_name || 'Utilisateur'}</div>
                <button 
                  onClick={handleLogout}
                  className="mt-2 text-xs flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </button>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-purple-100"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold flex-shrink-0">
                {getInitials(user?.full_name)}
              </div>
              <div className="ml-3 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{user?.full_name || 'Utilisateur'}</div>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  En ligne
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-auto p-1.5 rounded-full hover:bg-purple-100 transition-colors"
                title="Déconnexion"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile menu button - floating */}
        {isMobile && !mobileSidebarOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileSidebar}
            className="fixed z-20 top-4 left-4 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600 border border-purple-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        )}
        
        {/* Page header with title - visible on desktop */}
        {!isMobile && (
          <div className="h-16 px-6 flex items-center border-b border-purple-100 bg-white">
            <h1 className="text-xl font-semibold text-purple-800">{getPageTitle()}</h1>
            
            <div className="ml-auto flex items-center space-x-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 relative transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </motion.button>
              
              {/* Collapse sidebar button when expanded */}
              {!sidebarCollapsed && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSidebar}
                  className="hidden md:flex items-center text-xs font-medium py-1.5 px-3 rounded-lg text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Réduire
                </motion.button>
              )}
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-purple-50">
          <Routes>
            <Route path="/" element={
              <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
                <div className="md:col-span-8 lg:col-span-9">
                  <ChatInterface />
                </div>
                <div className="md:col-span-4 lg:col-span-3 hidden md:block">
                  <ChatHistory />
                </div>
              </div>
            } />
            <Route path="/chat" element={
              <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
                <div className="md:col-span-8 lg:col-span-9">
                  <ChatInterface />
                </div>
                <div className="md:col-span-4 lg:col-span-3 hidden md:block">
                  <ChatHistory />
                </div>
              </div>
            } />
            <Route path="/codes" element={<CodesJuridiques />} />
            <Route path="/codes/:codeId/:articleId" element={<CodesJuridiques />} />
            <Route path="/history" element={<ChatHistory fullWidth={true} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
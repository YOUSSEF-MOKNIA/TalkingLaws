import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import ChatHistory from './components/ChatHistory';
import CodesJuridiques from './components/CodesJuridiques';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4">
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app/*" element={
          <ProtectedRoute>
            <MainApp />
          </ProtectedRoute>
        } />
        {/* Redirect /chat, /codes, /history to /app/chat etc. */}
        <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
        <Route path="/codes" element={<Navigate to="/app/codes" replace />} />
        <Route path="/history" element={<Navigate to="/app/history" replace />} />
      </Routes>
    </Router>
  );
}

function MainApp() {
  const location = useLocation(); // Use React Router's useLocation
  const currentPath = location.pathname;
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setMobileSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close mobile sidebar when changing routes
  useEffect(() => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [location, isMobile]);
  
  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileSidebarOpen]);
  
  // Current page title based on path
  const getPageTitle = () => {
    if (currentPath === '/app/chat' || currentPath === '/app') return 'Assistant Juridique';
    if (currentPath === '/app/codes') return 'Codes Juridiques';
    if (currentPath === '/app/history') return 'Historique';
    if (currentPath.startsWith('/app/codes/')) return 'Article Juridique';
    return 'JuriDOC';
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-purple-50 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar 
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar Component */}
        <TopBar 
          isMobile={isMobile}
          title={getPageTitle()}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 h-full">
            <Routes>
              <Route path="/" element={<Navigate to="/app/chat" replace />} />
              <Route path="/chat" element={
                <div className="h-full">
                  {/* Chat interface now takes full width */}
                  <ChatInterface />
                </div>
              } />
              <Route path="/codes" element={<CodesJuridiques />} />
              <Route path="/codes/:codeId/:articleId" element={<CodesJuridiques />} />
              <Route path="/history" element={<ChatHistory fullWidth={true} isMobile={isMobile} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
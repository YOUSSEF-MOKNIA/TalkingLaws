import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ChatInterface from './components/ChatInterface';
import ChatHistory from './components/ChatHistory';
import CodesJuridiques from './components/CodesJuridiques';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Navigation item component with animation
const NavItem = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-indigo-900/40 text-white' 
        : 'text-indigo-200 hover:bg-indigo-900/20'
    }`}
  >
    <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 transition-all duration-200 ${
      active ? 'bg-indigo-600 text-white' : 'bg-indigo-900/30 text-indigo-300 group-hover:bg-indigo-700/50'
    }`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </Link>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
          <span className="text-gray-600">Chargement...</span>
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
  
  // Extract initials from full name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-indigo-800 text-white flex flex-col">
        {/* Logo area */}
        <div className="p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-700">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold">JuridDOC</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-4 flex-1">
          <div className="space-y-2">
            <NavItem 
              to="/" 
              active={currentPath === '/' || currentPath === '/chat'} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              } 
              label="Chat"
            />
            <NavItem 
              to="/codes" 
              active={currentPath.startsWith('/codes')} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              } 
              label="Codes Juridiques"
            />
            <NavItem 
              to="/history" 
              active={currentPath === '/history'} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } 
              label="Historique"
            />
          </div>
        </nav>
        
        {/* User area */}
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              {user ? getInitials(user.full_name) : 'U'}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-white">{user ? user.full_name : 'Utilisateur'}</div>
              <div className="flex items-center text-xs text-indigo-200">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                En ligne
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-auto p-1 rounded-full hover:bg-indigo-700"
              title="Déconnexion"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {(currentPath === '/' || currentPath === '/chat') && 'Assistant Juridique'}
              {currentPath === '/codes' && 'Codes Juridiques'}
              {currentPath === '/history' && 'Historique des conversations'}
              {currentPath.startsWith('/codes/') && 'Article Juridique'}
            </h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={
              <div className="h-full flex">
                <div className="flex-1 mr-6">
                  <ChatInterface />
                </div>
                <div className="w-80">
                  <ChatHistory />
                </div>
              </div>
            } />
            <Route path="/chat" element={
              <div className="h-full flex">
                <div className="flex-1 mr-6">
                  <ChatInterface />
                </div>
                <div className="w-80">
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
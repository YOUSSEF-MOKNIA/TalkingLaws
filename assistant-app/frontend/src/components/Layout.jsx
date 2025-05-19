import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Transition } from "@headlessui/react";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 border-r border-purple-100 bg-white z-10">
        <div className="p-4 border-b border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 3L4 9v12h16V9l-8-6z" />
                <path d="M12 16h-2v4h2v-4zM14 16v4h2v-4h-2z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              JuriDOC
            </span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 font-medium">
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg ${
                isActive 
                  ? "bg-purple-100 text-purple-800" 
                  : "text-gray-600 hover:bg-purple-50"
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <span>Chat</span>
          </NavLink>
          
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg ${
                isActive 
                  ? "bg-purple-100 text-purple-800" 
                  : "text-gray-600 hover:bg-purple-50"
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Historique</span>
          </NavLink>
          
          <NavLink
            to="/browse"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg ${
                isActive 
                  ? "bg-purple-100 text-purple-800" 
                  : "text-gray-600 hover:bg-purple-50"
              }`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Codes Juridiques</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-purple-100">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-lg">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Utilisateur</div>
              <div className="text-xs text-gray-500">Connecté</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header and menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-purple-100 z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 3L4 9v12h16V9l-8-6z" />
                <path d="M12 16h-2v4h2v-4zM14 16v4h2v-4h-2z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              JuriDOC
            </span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-purple-800"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        <Transition
          show={mobileMenuOpen}
          enter="transition-opacity duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            <NavLink
              to="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base ${
                  isActive 
                    ? "bg-purple-100 text-purple-800" 
                    : "text-gray-600 hover:bg-purple-50"
                }`
              }
            >
              Chat
            </NavLink>
            <NavLink
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base ${
                  isActive 
                    ? "bg-purple-100 text-purple-800" 
                    : "text-gray-600 hover:bg-purple-50"
                }`
              }
            >
              Historique
            </NavLink>
            <NavLink
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base ${
                  isActive 
                    ? "bg-purple-100 text-purple-800" 
                    : "text-gray-600 hover:bg-purple-50"
                }`
              }
            >
              Codes Juridiques
            </NavLink>
          </div>
        </Transition>
      </div>

      {/* Main content area */}
      <main className="flex-1 md:ml-64 lg:ml-72 h-screen overflow-hidden pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
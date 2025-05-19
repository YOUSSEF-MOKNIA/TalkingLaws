import React from "react";
import { motion } from "framer-motion";

export default function WelcomeScreen() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto py-10 px-4 text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        variants={item} 
        className="h-24 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12">
          <path d="M12 3L4 9v12h16V9l-8-6z" />
          <path d="M12 16h-2v4h2v-4zM14 16v4h2v-4h-2z" />
        </svg>
      </motion.div>
      
      <motion.h1 
        variants={item} 
        className="text-3xl font-bold text-gray-800 mb-2"
      >
        Bienvenue sur JuriDOC
      </motion.h1>
      
      <motion.p 
        variants={item} 
        className="text-gray-600 mb-8"
      >
        Votre assistant juridique intelligent pour le droit marocain
      </motion.p>
      
      <motion.div 
        variants={item} 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <div className="text-purple-700 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-gray-800 font-semibold mb-2">Posez vos questions</h3>
          <p className="text-gray-600 text-sm">Formulez vos questions juridiques en langage naturel</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <div className="text-purple-700 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-gray-800 font-semibold mb-2">Consultez les articles</h3>
          <p className="text-gray-600 text-sm">Accédez aux textes de loi pertinents pour votre question</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-purple-100">
          <div className="text-purple-700 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="text-gray-800 font-semibold mb-2">Réponses fiables</h3>
          <p className="text-gray-600 text-sm">Des informations juridiques précises basées sur la législation marocaine</p>
        </div>
      </motion.div>
      
      <motion.div variants={item} className="bg-white rounded-xl p-5 shadow-sm border border-purple-100 text-left">
        <h3 className="text-gray-800 font-semibold mb-2">Exemples de questions:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="bg-purple-50 rounded-lg p-2 hover:bg-purple-100 transition-colors cursor-pointer">
            Quelles sont les conditions pour obtenir le divorce au Maroc ?
          </li>
          <li className="bg-purple-50 rounded-lg p-2 hover:bg-purple-100 transition-colors cursor-pointer">
            Quels sont mes droits en tant que locataire d'un logement ?
          </li>
          <li className="bg-purple-50 rounded-lg p-2 hover:bg-purple-100 transition-colors cursor-pointer">
            Comment créer une entreprise au Maroc ? Quelles sont les démarches ?
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
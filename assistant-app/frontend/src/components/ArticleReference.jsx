import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function ArticleReference({ article }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Generate URL for the article
  const articleUrl = `/codes/${article.code?.replace(/\s+/g, '-').toLowerCase()}/${article.article_number}`;
  
  // Truncate text for preview
  const previewText = article.text || 'Texte non disponible';
    
  // Determine color based on code type with enhanced color palette
  const getCodeColor = (code) => {
    if (!code) return { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-200',
      shadow: 'shadow-gray-200/50'
    };
    
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('famille')) 
      return { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
        shadow: 'shadow-blue-200/50'
      };
    if (lowerCode.includes('commerce')) 
      return { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        hover: 'hover:bg-emerald-100',
        shadow: 'shadow-emerald-200/50'
      };
    if (lowerCode.includes('civil')) 
      return { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700',
        border: 'border-amber-200',
        hover: 'hover:bg-amber-100',
        shadow: 'shadow-amber-200/50'
      };
    if (lowerCode.includes('pénal')) 
      return { 
        bg: 'bg-red-50', 
        text: 'text-red-700',
        border: 'border-red-200',
        hover: 'hover:bg-red-100',
        shadow: 'shadow-red-200/50'
      };
    if (lowerCode.includes('travail')) 
      return { 
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100',
        shadow: 'shadow-purple-200/50'
      };
    if (lowerCode.includes('constitution')) 
      return { 
        bg: 'bg-indigo-50', 
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-100',
        shadow: 'shadow-indigo-200/50'
      };
    
    return { 
      bg: 'bg-violet-50', 
      text: 'text-violet-700',
      border: 'border-violet-200',
      hover: 'hover:bg-violet-100',
      shadow: 'shadow-violet-200/50'
    };
  };
  
  const codeColor = getCodeColor(article.code);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={`bg-white border ${codeColor.border} rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${codeColor.shadow}`}
    >
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${codeColor.bg} ${codeColor.text} border ${codeColor.border} ${codeColor.hover} transition-colors`}>
            {article.code || 'Code inconnu'}
          </span>
          <span className="text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
            Article {article.article_number || 'N/A'}
          </span>
        </div>
        
        <AnimatePresence initial={false}>
          <motion.div 
            key={isExpanded ? 'expanded' : 'collapsed'}
            initial={{ height: isExpanded ? 0 : 'auto' }}
            animate={{ 
              height: isExpanded ? 'auto' : article.text && article.text.length > 200 ? '5rem' : 'auto'
            }}
            exit={{ height: isExpanded ? 0 : 'auto' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative text-sm text-gray-700 mb-3 overflow-hidden"
          >
            <div className={`${!isExpanded && article.text && article.text.length > 200 ? 'line-clamp-3' : ''}`}>
              {previewText}
            </div>
            
            {!isExpanded && article.text && article.text.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between items-center mt-3">
          {article.text && article.text.length > 200 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-xs font-medium ${codeColor.text} hover:underline flex items-center transition-all duration-200`}
            >
              {isExpanded ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Réduire
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Voir plus
                </>
              )}
            </motion.button>
          )}
          
          {/* <motion.div
            whileHover={{ x: 3 }}
            className={`ml-auto ${article.text && article.text.length > 200 ? '' : 'w-full text-right'}`}
          >
            <Link 
              to={articleUrl} 
              className={`inline-flex items-center text-sm font-medium ${codeColor.text} hover:underline transition-colors`}
            >
              Article complet
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div> */}
        </div>
      </div>
    </motion.div>
  );
}

export default ArticleReference;
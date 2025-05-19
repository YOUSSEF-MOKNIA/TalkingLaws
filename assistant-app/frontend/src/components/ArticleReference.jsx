import React from 'react';
import { Link } from 'react-router-dom';

function ArticleReference({ article }) {
  // Generate URL for the article
  const articleUrl = `/codes/${article.code?.replace(/\s+/g, '-').toLowerCase()}/${article.article_number}`;
  
  // Truncate text to preview
  const previewText = article.text ? (
    article.text.length > 150 ? article.text.substring(0, 150) + '...' : article.text
  ) : 'Texte non disponible';
    
  // Determine color based on code type
  const getCodeColor = (code) => {
    if (!code) return 'bg-gray-100 text-gray-800';
    
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('famille')) return 'bg-blue-100 text-blue-800';
    if (lowerCode.includes('commerce')) return 'bg-emerald-100 text-emerald-800';
    if (lowerCode.includes('civil')) return 'bg-amber-100 text-amber-800';
    if (lowerCode.includes('pénal')) return 'bg-red-100 text-red-800';
    if (lowerCode.includes('travail')) return 'bg-purple-100 text-purple-800';
    if (lowerCode.includes('constitution')) return 'bg-indigo-100 text-indigo-800';
    
    return 'bg-gray-100 text-gray-800';
  };
  
  const codeColor = getCodeColor(article.code);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${codeColor}`}>
            {article.code || 'Code inconnu'}
          </span>
          <span className="text-xs font-medium text-gray-500">
            Art. {article.article_number || 'N/A'}
          </span>
        </div>
        
        <div className="text-sm text-gray-700 mb-4 line-clamp-4">
          {previewText}
        </div>
        
        <Link 
          to={articleUrl} 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Voir l'article complet
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default ArticleReference;
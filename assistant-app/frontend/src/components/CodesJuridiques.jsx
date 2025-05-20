import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import JSON files directly
import constitutionMarocaine2011 from '../assets/law_codes/constitution_marocaine_2011/articles.json';
import codePenale2018 from '../assets/law_codes/code_penale_2018/articles.json';
import codeTravail2011 from '../assets/law_codes/code_travail_2011/articles.json';
import codeObligationContrats2019 from '../assets/law_codes/code_obligation_contrats_2019/articles.json';
import codeCommerce2019 from '../assets/law_codes/code_commerce_2019/articles.json';
import codeFamille2016 from '../assets/law_codes/code_famille_2016/articles.json';

// Code metadata - titles, descriptions, etc.
const codeMetadata = {
  constitution_marocaine_2011: {
    title: "Constitution Marocaine",
    year: "2011",
    description: "La constitution du Royaume du Maroc de 2011",
    color: "bg-blue-100 text-blue-800",
    gradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
    darkColor: "bg-blue-700",
    hoverColor: "hover:bg-blue-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l9-4 9 4v12l-9 4-9-4V6z" />
      </svg>
    )
  },
  code_penale_2018: {
    title: "Code Pénal",
    year: "2018",
    description: "Code pénal marocain, version 2018",
    color: "bg-red-100 text-red-800",
    gradient: "from-red-50 to-red-100",
    borderColor: "border-red-200",
    iconColor: "text-red-500",
    darkColor: "bg-red-700",
    hoverColor: "hover:bg-red-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  code_travail_2011: {
    title: "Code du Travail",
    year: "2011",
    description: "Législation du travail au Maroc, version 2011",
    color: "bg-green-100 text-green-800",
    gradient: "from-green-50 to-green-100",
    borderColor: "border-green-200",
    iconColor: "text-green-500",
    darkColor: "bg-green-700",
    hoverColor: "hover:bg-green-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  code_obligation_contrats_2019: {
    title: "Code des Obligations et Contrats",
    year: "2019",
    description: "Dahir formant code des obligations et des contrats",
    color: "bg-yellow-100 text-yellow-800",
    gradient: "from-yellow-50 to-yellow-100",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-600",
    darkColor: "bg-yellow-600",
    hoverColor: "hover:bg-yellow-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  code_commerce_2019: {
    title: "Code de Commerce",
    year: "2019",
    description: "Loi relative au code de commerce marocain",
    color: "bg-purple-100 text-purple-800",
    gradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    iconColor: "text-purple-500",
    darkColor: "bg-purple-700",
    hoverColor: "hover:bg-purple-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  code_famille_2016: {
    title: "Code de la Famille",
    year: "2016",
    description: "Moudawana - Code du statut personnel marocain",
    color: "bg-teal-100 text-teal-800",
    gradient: "from-teal-50 to-teal-100",
    borderColor: "border-teal-200",
    iconColor: "text-teal-500",
    darkColor: "bg-teal-700",
    hoverColor: "hover:bg-teal-50",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
};

export default function CodesJuridiques() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codes, setCodes] = useState({});
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeArticleId, setActiveArticleId] = useState(null);

  // Format article text to ensure proper paragraphs
  const formatArticleText = (text) => {
    if (!text) return '';
    
    // Replace multiple consecutive newlines with a single one to avoid extra spacing
    const normalizedText = text.replace(/\n{3,}/g, '\n\n');
    
    // Split by periods followed by newlines or just periods at the end of text
    // This preserves intentional paragraph breaks
    const paragraphs = normalizedText.split(/\.\s*\n|\.\s*(?=\s*$)/);
    
    // Join with period and proper spacing
    return paragraphs
      .filter(p => p.trim())
      .map(p => p.trim())
      .join('.\n\n');
  };

  // Load all codes with structure
  useEffect(() => {
    const loadCodes = async () => {
      try {
        setLoading(true);
        
        // Create an object with all the imported code data
        const allCodes = {
          constitution_marocaine_2011: constitutionMarocaine2011,
          code_penale_2018: codePenale2018,
          code_travail_2011: codeTravail2011,
          code_obligation_contrats_2019: codeObligationContrats2019,
          code_commerce_2019: codeCommerce2019,
          code_famille_2016: codeFamille2016
        };
        
        const processedCodes = {};
        
        // Process each code to extract its structure
        Object.entries(allCodes).forEach(([codeId, codeData]) => {
          try {
            // Extract structure (titles, chapters, sections)
            const structure = extractCodeStructure(codeData);
            
            processedCodes[codeId] = {
              id: codeId,
              ...codeMetadata[codeId],
              structure,
              articles: codeData
            };
          } catch (err) {
            console.error(`Error processing ${codeId}:`, err);
          }
        });
        
        setCodes(processedCodes);
        setError(null);
      } catch (err) {
        console.error("Failed to load codes:", err);
        setError("Impossible de charger les codes juridiques. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    loadCodes();
  }, []);
  
  // Extract the hierarchical structure from code articles
  const extractCodeStructure = (articles) => {
    const structure = {
      titles: {},
      chapters: {},
      sections: {}
    };
    
    // Process each article to build the structure
    Object.values(articles).forEach(article => {
      const { title, chapter, section } = article;
      
      // Add title if it exists
      if (title && !structure.titles[title.id]) {
        structure.titles[title.id] = {
          id: title.id,
          name: title.name,
          chapters: {}
        };
      }
      
      // Add chapter if it exists
      if (chapter && !structure.chapters[chapter.id]) {
        structure.chapters[chapter.id] = {
          id: chapter.id,
          name: chapter.name,
          titleId: title?.id,
          sections: {}
        };
        
        // Add chapter to its parent title
        if (title) {
          structure.titles[title.id].chapters[chapter.id] = chapter.id;
        }
      }
      
      // Add section if it exists
      if (section && !structure.sections[section.id]) {
        structure.sections[section.id] = {
          id: section.id,
          name: section.name,
          chapterId: chapter?.id
        };
        
        // Add section to its parent chapter
        if (chapter) {
          structure.chapters[chapter.id].sections[section.id] = section.id;
        }
      }
    });
    
    return structure;
  };
  
  // Handle code selection
  const handleCodeSelect = (codeId) => {
    setSelectedCode(codeId);
    setSelectedTitle(null);
    setSelectedChapter(null);
    setSelectedSection(null);
    setActiveArticleId(null);
    setSidebarOpen(true);
  };
  
  // Handle title selection
  const handleTitleSelect = (titleId) => {
    setSelectedTitle(titleId);
    setSelectedChapter(null);
    setSelectedSection(null);
    setActiveArticleId(null);
  };
  
  // Handle chapter selection
  const handleChapterSelect = (chapterId) => {
    setSelectedChapter(chapterId);
    setSelectedSection(null);
    setActiveArticleId(null);
  };
  
  // Handle section selection
  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    setActiveArticleId(null);
  };
  
  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Search in all codes
    const results = [];
    
    Object.values(codes).forEach(code => {
      const codeArticles = code.articles;
      
      Object.entries(codeArticles).forEach(([articleId, article]) => {
        const articleNumber = article.article_no || article.article_number || '';
        const articleText = article.text || '';
        
        // Search in article number and text
        if (
          articleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          articleText.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            codeId: code.id,
            codeName: code.title,
            articleId,
            articleNumber,
            articleText,
            highlightedText: highlightSearchTerm(articleText, searchQuery)
          });
        }
      });
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  // Highlight search term in text
  const highlightSearchTerm = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>');
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Get articles for selected section or chapter
  const selectedArticles = useMemo(() => {
    if (!selectedCode) return [];
    
    const codeArticles = codes[selectedCode]?.articles;
    if (!codeArticles) return [];
    
    return Object.entries(codeArticles)
      .filter(([_, article]) => {
        if (selectedSection) {
          return article.section?.id === selectedSection;
        } else if (selectedChapter) {
          return article.chapter?.id === selectedChapter && !article.section;
        } else if (selectedTitle) {
          return article.title?.id === selectedTitle && !article.chapter;
        } else {
          return !article.title;
        }
      })
      .map(([id, article]) => ({
        id,
        // Check for both article_no and article_number fields
        number: article.article_no || article.article_number || '',
        text: article.text || ''
      }))
      .sort((a, b) => {
        // Extract numeric parts from article numbers for better sorting
        const aMatch = a.number.match(/(\d+)/);
        const bMatch = b.number.match(/(\d+)/);
        
        const aNum = aMatch ? parseInt(aMatch[0]) : NaN;
        const bNum = bMatch ? parseInt(bMatch[0]) : NaN;
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        } else if (!isNaN(aNum)) {
          return -1; // Numbers come before non-numbers
        } else if (!isNaN(bNum)) {
          return 1;  // Numbers come before non-numbers
        }
        
        // If neither has numeric part, sort alphabetically
        return (a.number || '').localeCompare(b.number || '');
      });
  }, [codes, selectedCode, selectedTitle, selectedChapter, selectedSection]);
  
  // Get active article
  const activeArticle = useMemo(() => {
    if (!activeArticleId) return null;
    
    return selectedArticles.find(article => article.id === activeArticleId) || null;
  }, [selectedArticles, activeArticleId]);
  
  // Get breadcrumb trail
  const breadcrumbs = useMemo(() => {
    const trail = [];
    
    if (selectedCode && codes[selectedCode]) {
      trail.push({
        id: selectedCode,
        name: `${codes[selectedCode].title} ${codes[selectedCode].year}`,
        onClick: () => {
          setSelectedTitle(null);
          setSelectedChapter(null);
          setSelectedSection(null);
          setActiveArticleId(null);
        }
      });
    }
    
    if (selectedTitle && codes[selectedCode]?.structure.titles[selectedTitle]) {
      trail.push({
        id: selectedTitle,
        name: codes[selectedCode].structure.titles[selectedTitle].name,
        onClick: () => {
          setSelectedChapter(null);
          setSelectedSection(null);
          setActiveArticleId(null);
        }
      });
    }
    
    if (selectedChapter && codes[selectedCode]?.structure.chapters[selectedChapter]) {
      trail.push({
        id: selectedChapter,
        name: codes[selectedCode].structure.chapters[selectedChapter].name,
        onClick: () => {
          setSelectedSection(null);
          setActiveArticleId(null);
        }
      });
    }
    
    if (selectedSection && codes[selectedCode]?.structure.sections[selectedSection]) {
      trail.push({
        id: selectedSection,
        name: codes[selectedCode].structure.sections[selectedSection].name,
        onClick: () => {
          setActiveArticleId(null);
        }
      });
    }
    
    if (activeArticle) {
      trail.push({
        id: activeArticleId,
        name: `Article ${activeArticle.number}`,
        onClick: () => {}
      });
    }
    
    return trail;
  }, [codes, selectedCode, selectedTitle, selectedChapter, selectedSection, activeArticleId, activeArticle]);

  // Render component
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header with search and title */}
      <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Codes Juridiques Marocains</h1>
            <p className="text-sm text-gray-600">Consultez les textes de loi marocains en vigueur</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 shadow-sm"
                disabled={loading}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 flex items-center shadow-sm"
              disabled={loading || !searchQuery.trim() || isSearching}
            >
              {isSearching ? (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              Rechercher
            </button>
          </form>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Chargement des codes juridiques...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {!loading && error && (
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
      
      {/* Content - Grid display of codes or detailed view */}
      {!loading && !error && (
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Breadcrumb navigation for selected code */}
          {selectedCode && breadcrumbs.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <nav className="flex items-center space-x-1 text-sm overflow-x-auto whitespace-nowrap p-1">
                <button
                  onClick={() => {
                    setSelectedCode(null);
                    setSelectedTitle(null);
                    setSelectedChapter(null);
                    setSelectedSection(null);
                    setActiveArticleId(null);
                  }}
                  className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Codes
                </button>
                
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.id}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button
                      onClick={crumb.onClick}
                      className={`${index === breadcrumbs.length - 1 
                        ? "font-medium text-gray-800" 
                        : "text-purple-600 hover:text-purple-800"} truncate max-w-xs`}
                    >
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
              
              {selectedCode && (
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100"
                >
                  {sidebarOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          )}
          
          {/* Main content area */}
          <div className="flex-grow flex overflow-hidden">
            {/* Code grid view when no code is selected */}
            {!selectedCode && !searchResults.length && (
              <div className="flex-grow p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.values(codes).map(code => (
                    <motion.div
                      key={code.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCodeSelect(code.id)}
                      className={`rounded-xl overflow-hidden shadow-md border ${code.borderColor} bg-white cursor-pointer transition-all duration-200 flex flex-col`}
                    >
                      <div className={`h-24 ${code.darkColor} text-white p-4 flex items-center`}>
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                          <div className={code.iconColor}>
                            {code.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{code.title}</h3>
                          <div className="text-sm text-white/80">{code.year}</div>
                        </div>
                      </div>
                      <div className="p-4 flex-grow">
                        <p className="text-sm text-gray-600">{code.description}</p>
                      </div>
                      <div className={`px-4 py-3 border-t ${code.borderColor} bg-gradient-to-r ${code.gradient} flex justify-between items-center`}>
                        <div className="text-xs text-gray-500">
                          {Object.keys(code.articles).length} articles
                        </div>
                        <div className={`text-xs ${code.iconColor} font-medium flex items-center`}>
                          Explorer
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Code detailed view when a code is selected */}
            {selectedCode && !searchResults.length && (
              <div className="flex-grow flex overflow-hidden">
                {/* Left sidebar for navigation */}
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                      className="border-r border-gray-200 flex-shrink-0 overflow-y-auto bg-gray-50"
                    >
                      <div className="p-3 space-y-4">
                        {/* Code info */}
                        <div className={`p-3 rounded-lg ${codes[selectedCode]?.color} ${codes[selectedCode]?.borderColor} border`}>
                          <h3 className="font-medium">{codes[selectedCode]?.title} ({codes[selectedCode]?.year})</h3>
                          <p className="text-xs mt-1">{codes[selectedCode]?.description}</p>
                        </div>
                        
                        {/* Titles section */}
                        {!selectedTitle && (
                          <div className="space-y-1">
                            <h2 className="text-xs font-semibold text-gray-500 px-2 py-1 uppercase">Titres</h2>
                            <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                              {Object.values(codes[selectedCode]?.structure.titles || {}).map(title => (
                                <button
                                  key={title.id}
                                  onClick={() => handleTitleSelect(title.id)}
                                  className="w-full text-left p-2.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-700">{title.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Chapters section */}
                        {selectedTitle && !selectedChapter && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between px-2 py-1">
                              <h2 className="text-xs font-semibold text-gray-500 uppercase">Chapitres</h2>
                              <button 
                                onClick={() => setSelectedTitle(null)}
                                className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Retour
                              </button>
                            </div>
                            <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                              {Object.values(codes[selectedCode]?.structure.chapters || {})
                                .filter(chapter => chapter.titleId === selectedTitle)
                                .map(chapter => (
                                  <button
                                    key={chapter.id}
                                    onClick={() => handleChapterSelect(chapter.id)}
                                    className="w-full text-left p-2.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all flex items-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{chapter.name}</span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Sections section */}
                        {selectedChapter && !selectedSection && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between px-2 py-1">
                              <h2 className="text-xs font-semibold text-gray-500 uppercase">Sections</h2>
                              <button 
                                onClick={() => setSelectedChapter(null)}
                                className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Retour
                              </button>
                            </div>
                            <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                              {Object.values(codes[selectedCode]?.structure.sections || {})
                                .filter(section => section.chapterId === selectedChapter)
                                .map(section => (
                                  <button
                                    key={section.id}
                                    onClick={() => handleSectionSelect(section.id)}
                                    className="w-full text-left p-2.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all flex items-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{section.name}</span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Back button for sections */}
                        {selectedSection && (
                          <div className="flex items-center justify-between px-2 py-1">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase">Articles</h2>
                            <button 
                              onClick={() => setSelectedSection(null)}
                              className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              Retour
                            </button>
                          </div>
                        )}
                        
                        {/* Articles navigation on sidebar */}
                        {selectedArticles.length > 0 && (
                          <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                            {selectedArticles.map(article => (
                              <button
                                key={article.id}
                                onClick={() => setActiveArticleId(article.id)}
                                className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center ${
                                  activeArticleId === article.id 
                                    ? `${codes[selectedCode]?.color} border ${codes[selectedCode]?.borderColor}` 
                                    : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2.5 ${
                                  activeArticleId === article.id ? codes[selectedCode]?.iconColor : 'text-gray-400'
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className={`text-sm ${
                                  activeArticleId === article.id ? 'font-medium' : 'text-gray-700'
                                }`}>
                                   {article.number || 'sans numéro'}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Main article content */}
                <div className="flex-grow overflow-y-auto bg-white">
                  {/* When no specific article is selected */}
                  {!activeArticleId ? (
                    <div className="p-6">
                      {selectedArticles.length > 0 ? (
                        <div className="space-y-6">
                          {selectedArticles.map(article => (
                            <motion.div
                              key={article.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              onClick={() => setActiveArticleId(article.id)}
                              className={`border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className={`font-bold text-lg text-gray-800 ${codes[selectedCode]?.iconColor}`}>
                                 {article.number || 'sans numéro'}
                                </h3>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                                  Cliquer pour voir les détails
                                </span>
                              </div>
                              <div className="text-gray-700 line-clamp-3">
                                {article.text.substring(0, 350)}
                                {article.text.length > 350 && '...'}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-800 mb-1">Aucun article disponible</h3>
                          <p className="text-gray-600">
                            Il n'y a pas d'articles directement associés à cette sélection.
                            <br />
                            Veuillez sélectionner une autre catégorie.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 max-w-3xl mx-auto">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border ${codes[selectedCode]?.borderColor} rounded-xl p-6 bg-white shadow-md`}
                      >
                        <div className={`px-4 py-3 -mx-6 -mt-6 mb-6 ${codes[selectedCode]?.color} rounded-t-xl border-b ${codes[selectedCode]?.borderColor} flex items-center justify-between`}>
                          <h3 className="font-bold text-xl">
                            Article {activeArticle?.number || 'sans numéro'}
                          </h3>
                          <button
                            onClick={() => setActiveArticleId(null)}
                            className="text-sm flex items-center hover:underline"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Retour
                          </button>
                        </div>
                        
                        <div className="prose prose-sm sm:prose max-w-none text-gray-800">
                          {formatArticleText(activeArticle?.text || '').split('\n\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {codes[selectedCode]?.title} • {codes[selectedCode]?.year}
                          </span>
                          
                          <div className="flex space-x-3">
                            <button 
                              className="text-purple-600 hover:text-purple-800 flex items-center"
                              onClick={() => {
                                // Copy article text to clipboard
                                navigator.clipboard.writeText(`Article ${activeArticle?.number}: ${activeArticle?.text}`);
                                // Would add toast notification here in a real app
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                              Copier
                            </button>
                            <a 
                              href={`#article-${activeArticle?.number}`}
                              className="text-purple-600 hover:text-purple-800 flex items-center"
                              onClick={(e) => {
                                e.preventDefault();
                                // Would handle sharing here in a real app
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              Partager
                            </a>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Article navigation buttons */}
                      <div className="flex justify-between mt-6">
                        {/* Previous article button */}
                        {selectedArticles.findIndex(a => a.id === activeArticleId) > 0 && (
                          <button
                            onClick={() => {
                              const currentIndex = selectedArticles.findIndex(a => a.id === activeArticleId);
                              const prevArticle = selectedArticles[currentIndex - 1];
                              if (prevArticle) {
                                setActiveArticleId(prevArticle.id);
                              }
                            }}
                            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Article précédent
                          </button>
                        )}
                        
                        <div className="flex-grow"></div>
                        
                        {/* Next article button */}
                        {selectedArticles.findIndex(a => a.id === activeArticleId) < selectedArticles.length - 1 && (
                          <button
                            onClick={() => {
                              const currentIndex = selectedArticles.findIndex(a => a.id === activeArticleId);
                              const nextArticle = selectedArticles[currentIndex + 1];
                              if (nextArticle) {
                                setActiveArticleId(nextArticle.id);
                              }
                            }}
                            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          >
                            Article suivant
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="flex-grow overflow-y-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Résultats de recherche ({searchResults.length})
                  </h2>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Effacer
                  </button>
                </div>
                
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        handleCodeSelect(result.codeId);
                        // Would navigate to the specific article in a real implementation
                      }}
                    >
                      <div className="flex items-center mb-3">
                        <span className="font-medium px-2.5 py-0.5 rounded-full text-xs mr-2 bg-gray-100 text-gray-800">
                          {result.codeName}
                        </span>
                        <span className="font-bold text-gray-800 text-sm">
                          {result.articleNumber ? `Article ${result.articleNumber}` : 'Article sans numéro'}
                        </span>
                      </div>
                      <div 
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{ 
                          __html: result.highlightedText.substring(0, 300) + (result.articleText.length > 300 ? '...' : '')
                        }} 
                      />
                      <div className="mt-3 text-xs text-purple-600 hover:text-purple-800 flex items-center justify-end">
                        Voir l'article complet
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
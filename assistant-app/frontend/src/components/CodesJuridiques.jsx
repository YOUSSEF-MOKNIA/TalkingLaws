import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CODES_CONFIG, getAllCodes, getCodeById } from '../config/codesConfig';

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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed to false by default
  const [activeArticleId, setActiveArticleId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;

      setIsMobile(mobile);
      setIsTablet(tablet);

      // Auto-close sidebar on mobile/tablet
      if (mobile || tablet) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Beautiful, cohesive color palette
  const colorPalette = [
    {
      name: 'Indigo',
      accent: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      hover: 'hover:bg-indigo-100',
      tag: 'bg-indigo-100 text-indigo-800'
    },
    {
      name: 'Emerald',
      accent: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      hover: 'hover:bg-emerald-100',
      tag: 'bg-emerald-100 text-emerald-800'
    },
    {
      name: 'Rose',
      accent: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-200',
      hover: 'hover:bg-rose-100',
      tag: 'bg-rose-100 text-rose-800'
    },
    {
      name: 'Amber',
      accent: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      hover: 'hover:bg-amber-100',
      tag: 'bg-amber-100 text-amber-800'
    },
    {
      name: 'Purple',
      accent: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100',
      tag: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Cyan',
      accent: 'from-cyan-500 to-cyan-600',
      bg: 'bg-cyan-50',
      text: 'text-cyan-900',
      border: 'border-cyan-200',
      hover: 'hover:bg-cyan-100',
      tag: 'bg-cyan-100 text-cyan-800'
    },
    {
      name: 'Pink',
      accent: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-50',
      text: 'text-pink-900',
      border: 'border-pink-200',
      hover: 'hover:bg-pink-100',
      tag: 'bg-pink-100 text-pink-800'
    },
    {
      name: 'Blue',
      accent: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
      tag: 'bg-blue-100 text-blue-800'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Load all codes with structure
  useEffect(() => {
    const loadCodes = async () => {
      try {
        setLoading(true);

        const allCodes = getAllCodes();
        const processedCodes = {};

        allCodes.forEach((codeConfig, index) => {
          try {
            const structure = extractCodeStructure(codeConfig.data);
            processedCodes[codeConfig.id] = {
              ...codeConfig,
              structure,
              articles: codeConfig.data,
              palette: colorPalette[index % colorPalette.length]
            };
          } catch (err) {
            console.error(`Error processing ${codeConfig.id}:`, err);
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

    Object.values(articles).forEach(article => {
      const { title, chapter, section } = article;

      if (title && !structure.titles[title.id]) {
        structure.titles[title.id] = {
          id: title.id,
          name: title.name,
          chapters: {}
        };
      }

      if (chapter && !structure.chapters[chapter.id]) {
        structure.chapters[chapter.id] = {
          id: chapter.id,
          name: chapter.name,
          titleId: title?.id,
          sections: {}
        };

        if (title) {
          structure.titles[title.id].chapters[chapter.id] = chapter.id;
        }
      }

      if (section && !structure.sections[section.id]) {
        structure.sections[section.id] = {
          id: section.id,
          name: section.name,
          chapterId: chapter?.id
        };

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
    if (!isMobile && !isTablet) {
      setSidebarOpen(true);
    }
  };

  // Handle title selection
  const handleTitleSelect = (titleId) => {
    setSelectedTitle(titleId);
    setSelectedChapter(null);
    setSelectedSection(null);
    setActiveArticleId(null);
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  // Handle chapter selection
  const handleChapterSelect = (chapterId) => {
    setSelectedChapter(chapterId);
    setSelectedSection(null);
    setActiveArticleId(null);
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  // Handle section selection
  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId);
    setActiveArticleId(null);
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    const results = [];

    Object.values(codes).forEach(code => {
      const codeArticles = code.articles;

      Object.entries(codeArticles).forEach(([articleId, article]) => {
        const articleNumber = article.article_no || article.article_number || '';
        const articleText = article.text || '';

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
            highlightedText: highlightSearchTerm(articleText, searchQuery),
            palette: code.palette
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
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 py-0.5 rounded-md font-medium">$1</mark>');
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
        number: article.article_no || article.article_number || '',
        text: article.text || ''
      }))
      .sort((a, b) => {
        const aMatch = a.number.match(/(\d+)/);
        const bMatch = b.number.match(/(\d+)/);
        const aNum = aMatch ? parseInt(aMatch[0]) : NaN;
        const bNum = bMatch ? parseInt(bMatch[0]) : NaN;

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        } else if (!isNaN(aNum)) {
          return -1;
        } else if (!isNaN(bNum)) {
          return 1;
        }
        return (a.number || '').localeCompare(b.number || '');
      });
  }, [codes, selectedCode, selectedTitle, selectedChapter, selectedSection]);

  // Format article text to ensure proper paragraphs
  const formatArticleText = (text) => {
    if (!text) return '';
    const normalizedText = text.replace(/\n{3,}/g, '\n\n');
    const paragraphs = normalizedText.split(/\.\s*\n|\.\s*(?=\s*$)/);
    return paragraphs
      .filter(p => p.trim())
      .map(p => p.trim())
      .join('.\n\n');
  };

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
        name: isMobile
          ? codes[selectedCode].shortTitle || codes[selectedCode].title.substring(0, 20) + '...'
          : `${codes[selectedCode].title} ${codes[selectedCode].year}`,
        onClick: () => {
          setSelectedTitle(null);
          setSelectedChapter(null);
          setSelectedSection(null);
          setActiveArticleId(null);
        }
      });
    }

    if (selectedTitle && codes[selectedCode]?.structure.titles[selectedTitle]) {
      const titleName = codes[selectedCode].structure.titles[selectedTitle].name;
      trail.push({
        id: selectedTitle,
        name: isMobile && titleName.length > 30 ? titleName.substring(0, 30) + '...' : titleName,
        onClick: () => {
          setSelectedChapter(null);
          setSelectedSection(null);
          setActiveArticleId(null);
        }
      });
    }

    if (selectedChapter && codes[selectedCode]?.structure.chapters[selectedChapter]) {
      const chapterName = codes[selectedCode].structure.chapters[selectedChapter].name;
      trail.push({
        id: selectedChapter,
        name: isMobile && chapterName.length > 30 ? chapterName.substring(0, 30) + '...' : chapterName,
        onClick: () => {
          setSelectedSection(null);
          setActiveArticleId(null);
        }
      });
    }

    if (selectedSection && codes[selectedCode]?.structure.sections[selectedSection]) {
      const sectionName = codes[selectedCode].structure.sections[selectedSection].name;
      trail.push({
        id: selectedSection,
        name: isMobile && sectionName.length > 30 ? sectionName.substring(0, 30) + '...' : sectionName,
        onClick: () => {
          setActiveArticleId(null);
        }
      });
    }

    if (activeArticle) {
      trail.push({
        id: activeArticleId,
        name: `Article ${activeArticle.number}`,
        onClick: () => { }
      });
    }

    return trail;
  }, [codes, selectedCode, selectedTitle, selectedChapter, selectedSection, activeArticleId, activeArticle, isMobile]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement des codes juridiques</h3>
            <p className="text-gray-600">Veuillez patienter un moment...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render error state
  if (!loading && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <motion.div
          className="flex flex-col items-center text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title and Logo - Mobile Responsive */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                    {isMobile ? 'Codes Juridiques' : 'Codes Juridiques Marocains'}
                  </h1>
                  <p className="text-gray-600 text-sm hidden sm:block">
                    Explorez les textes de loi marocains en vigueur
                  </p>
                </div>
              </div>

              {/* Mobile menu button for sidebar */}
              {selectedCode && (isMobile || isTablet) && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                  aria-label="Toggle navigation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Actions Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* View Mode Toggle - Hidden on mobile when code is selected */}
              {!selectedCode && !searchResults.length && !isMobile && (
                <div className="bg-gray-100 rounded-lg p-1 flex items-center">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Search Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative flex-1 sm:w-64 lg:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder={isMobile ? "Rechercher..." : "Rechercher un article..."}
                    className="w-full px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-8 sm:right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <svg className="animate-spin h-4 w-4 sm:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="hidden sm:inline">Rechercher</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile/Tablet Sidebar Overlay */}
        <AnimatePresence>
          {(isMobile || isTablet) && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {selectedCode && sidebarOpen && (
            <motion.div
              initial={{
                width: isMobile || isTablet ? 0 : 0,
                opacity: 0,
                x: isMobile || isTablet ? -320 : 0
              }}
              animate={{
                width: isMobile || isTablet ? 320 : 350,
                opacity: 1,
                x: 0
              }}
              exit={{
                width: 0,
                opacity: 0,
                x: isMobile || isTablet ? -320 : 0
              }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`
                ${isMobile || isTablet ? 'fixed left-0 top-0 h-full z-50' : 'relative'}
                bg-white border-r border-gray-200/50 flex-shrink-0 overflow-y-auto shadow-xl
              `}
            >
              <div className="p-4 sm:p-6 space-y-6">
                {/* Mobile close button */}
                {(isMobile || isTablet) && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Code info card */}
                <div className="p-4 sm:p-6 rounded-2xl bg-white shadow-lg border border-gray-200/50">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${codes[selectedCode]?.palette.accent} text-white flex items-center justify-center mr-3 sm:mr-4 shadow-lg`}>
                      {codes[selectedCode]?.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
                        {isMobile ? codes[selectedCode]?.shortTitle || codes[selectedCode]?.title : codes[selectedCode]?.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${codes[selectedCode]?.palette.tag}`}>
                        {codes[selectedCode]?.year}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {codes[selectedCode]?.description}
                  </p>
                </div>

                {/* Navigation sections */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                  {/* Titles */}
                  {!selectedTitle && Object.keys(codes[selectedCode]?.structure.titles || {}).length > 0 && (
                    <div className="p-4 sm:p-6">
                      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Titres</h2>
                      <div className="space-y-2">
                        {Object.values(codes[selectedCode]?.structure.titles || {}).map(title => (
                          <button
                            key={title.id}
                            onClick={() => handleTitleSelect(title.id)}
                            className="w-full text-left p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-all flex items-center group"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-800 font-medium truncate">{title.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chapters */}
                  {selectedTitle && Object.values(codes[selectedCode]?.structure.chapters || {})
                    .filter(chapter => chapter.titleId === selectedTitle)
                    .length > 0 && (
                      <div className="p-4 sm:p-6">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Chapitres</h2>
                        <div className="space-y-2">
                          {Object.values(codes[selectedCode]?.structure.chapters || {})
                            .filter(chapter => chapter.titleId === selectedTitle)
                            .map(chapter => (
                              <button
                                key={chapter.id}
                                onClick={() => handleChapterSelect(chapter.id)}
                                className="w-full text-left p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-all flex items-center group"
                              >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-800 font-medium truncate">{chapter.name}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Sections */}
                  {selectedChapter && Object.values(codes[selectedCode]?.structure.sections || {})
                    .filter(section => section.chapterId === selectedChapter)
                    .length > 0 && (
                      <div className="p-4 sm:p-6">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Sections</h2>
                        <div className="space-y-2">
                          {Object.values(codes[selectedCode]?.structure.sections || {})
                            .filter(section => section.chapterId === selectedChapter)
                            .map(section => (
                              <button
                                key={section.id}
                                onClick={() => handleSectionSelect(section.id)}
                                className="w-full text-left p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-all flex items-center group"
                              >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-800 font-medium truncate">{section.name}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb navigation */}
          {selectedCode && breadcrumbs.length > 0 && (
            <motion.div
              className="p-4 sm:p-6 bg-white/70 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <nav className="flex items-center space-x-1 sm:space-x-2 text-sm overflow-x-auto flex-1 min-w-0">
                <button
                  onClick={() => {
                    setSelectedCode(null);
                    setSelectedTitle(null);
                    setSelectedChapter(null);
                    setSelectedSection(null);
                    setActiveArticleId(null);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-indigo-50 whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Accueil</span>
                  <span className="sm:hidden">←</span>
                </button>

                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.id}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button
                      onClick={crumb.onClick}
                      className={`transition-colors truncate px-2 sm:px-3 py-2 rounded-lg whitespace-nowrap ${index === breadcrumbs.length - 1
                        ? "font-semibold text-gray-900 bg-gray-100"
                        : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                        }`}
                      style={{ maxWidth: isMobile ? '120px' : '200px' }}
                    >
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </nav>

              {/* Desktop sidebar toggle */}
              {selectedCode && !isMobile && !isTablet && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors ml-4 flex-shrink-0"
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
            </motion.div>
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Code grid/list view */}
              {!selectedCode && !searchResults.length && (
                <motion.div
                  className={
                    viewMode === 'grid'
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                      : "space-y-4 sm:space-y-6"
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {Object.values(codes).map(code => (
                    <motion.div
                      key={code.id}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCodeSelect(code.id)}
                      className={`
                        bg-white cursor-pointer shadow-lg hover:shadow-2xl border border-gray-200/50 transition-all duration-300 group
                        ${viewMode === 'grid'
                          ? 'rounded-2xl overflow-hidden'
                          : 'rounded-2xl flex overflow-hidden'
                        }
                      `}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          {/* Grid View */}
                          <div className="p-6 sm:p-8">
                            <div className="flex items-center mb-4 sm:mb-6">
                              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${code.palette.accent} text-white flex items-center justify-center mr-3 sm:mr-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                {code.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors truncate">
                                  {isMobile ? code.shortTitle || code.title : code.shortTitle || code.title}
                                </h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${code.palette.tag}`}>
                                  {code.year}
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm line-clamp-3">
                              {code.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {Object.keys(code.articles).length} articles
                              </div>

                              <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
                                Explorer
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* List View */}
                          <div className={`w-16 sm:w-20 bg-gradient-to-br ${code.palette.accent} flex items-center justify-center p-4`}>
                            <div className="text-white group-hover:scale-110 transition-transform">
                              {code.icon}
                            </div>
                          </div>
                          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                                  {code.title}
                                </h3>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${code.palette.tag} ml-3 flex-shrink-0`}>
                                  {code.year}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {code.description}
                              </p>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-xs text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {Object.keys(code.articles).length} articles
                              </div>

                              <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
                                Explorer
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Code Detail View */}
              {selectedCode && !searchResults.length && (
                <div>
                  {!activeArticleId ? (
                    <div>
                      {selectedArticles.length > 0 ? (
                        <motion.div
                          className="space-y-4 sm:space-y-6"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {selectedArticles.map(article => (
                            <motion.div
                              key={article.id}
                              variants={cardVariants}
                              onClick={() => setActiveArticleId(article.id)}
                              className="border border-gray-200/50 rounded-2xl p-6 sm:p-8 bg-white hover:shadow-xl transition-all cursor-pointer group"
                            >
                              <h3 className="font-bold text-xl sm:text-2xl text-indigo-600 mb-4 group-hover:scale-105 transition-transform origin-left">
                                {article.number || 'sans numéro'}
                              </h3>
                              <div className="text-gray-700 line-clamp-3 sm:line-clamp-4 leading-relaxed text-sm sm:text-base">
                                {article.text}
                              </div>
                              <div className="mt-4 text-sm text-indigo-600 opacity-70 group-hover:opacity-100 transition-opacity">
                                Cliquez pour lire l'article complet →
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Aucun article disponible</h3>
                          <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
                            Il n'y a pas d'articles directement associés à cette sélection.
                            Veuillez sélectionner une autre catégorie dans le menu de navigation.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Individual article view
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto"
                    >
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                        {/* Article header */}
                        <div className={`px-6 sm:px-10 py-6 sm:py-8 bg-gradient-to-r ${codes[selectedCode]?.palette.accent} text-white`}>
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                                {activeArticle?.number || 'sans numéro'}
                              </h1>
                              <p className="text-white/80 text-base sm:text-lg truncate">
                                {codes[selectedCode]?.title} • {codes[selectedCode]?.year}
                              </p>
                            </div>
                            <button
                              onClick={() => setActiveArticleId(null)}
                              className="p-2 sm:p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors shadow-lg flex-shrink-0 ml-4"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Article content */}
                        <div className="p-6 sm:p-10">
                          <div className="prose prose-sm sm:prose-lg max-w-none">
                            {formatArticleText(activeArticle?.text || '').split('\n\n').map((paragraph, i) => (
                              <p key={i} className="mb-4 sm:mb-6 text-gray-700 leading-relaxed">{paragraph}</p>
                            ))}
                          </div>

                          {/* Article actions */}
                          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-3">
                              <button
                                className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors shadow-sm hover:shadow-md text-sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(`Article ${activeArticle?.number}: ${activeArticle?.text}`);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />import React, {useState, useEffect, useMemo} from 'react';
                                </svg>
                                Copier
                              </button>
                              <button
                                className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors shadow-sm hover:shadow-md text-sm"
                                onClick={() => {
                                  const printContent = `
                                    <html>
                                      <head>
                                        <title>Article ${activeArticle?.number}</title>
                                        <style>
                                          body { font-family: Arial, sans-serif; margin: 40px; }
                                          h1 { color: #4f46e5; }
                                          p { line-height: 1.6; margin-bottom: 16px; }
                                        </style>
                                      </head>
                                      <body>
                                        <h1>Article ${activeArticle?.number}</h1>
                                        <h2>${codes[selectedCode]?.title} • ${codes[selectedCode]?.year}</h2>
                                        <div>${formatArticleText(activeArticle?.text || '').split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
                                      </body>
                                    </html>
                                  `;
                                  const printWindow = window.open('', '_blank');
                                  printWindow.document.write(printContent);
                                  printWindow.document.close();
                                  printWindow.print();
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Imprimer
                              </button>
                            </div>

                            <div className="text-sm text-gray-500">
                              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <motion.div
                    className="mb-6 sm:mb-8 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Résultats de recherche
                    </h2>
                    <p className="text-gray-600">
                      {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''} pour "{searchQuery}"
                    </p>
                  </motion.div>

                  <motion.div
                    className="space-y-4 sm:space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={`${result.codeId}-${result.articleId}`}
                        variants={cardVariants}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all"
                      >
                        <div className="p-6 sm:p-8">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${result.palette.accent} text-white flex items-center justify-center shadow-lg`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="font-bold text-lg sm:text-xl text-indigo-600 mb-1">
                                  Article {result.articleNumber || 'sans numéro'}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {result.codeName}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedCode(result.codeId);
                                setActiveArticleId(result.articleId);
                                setSearchResults([]);
                                setSearchQuery('');
                              }}
                              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
                            >
                              Voir l'article
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>

                          <div
                            className="text-gray-700 leading-relaxed text-sm sm:text-base line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* No results message */}
              {searchQuery && searchResults.length === 0 && !isSearching && (
                <motion.div
                  className="text-center py-12 sm:py-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Aucun résultat trouvé</h3>
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
                    Aucun article ne correspond à votre recherche "{searchQuery}".
                    Essayez avec d'autres mots-clés ou vérifiez l'orthographe.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg"
                  >
                    Effacer la recherche
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
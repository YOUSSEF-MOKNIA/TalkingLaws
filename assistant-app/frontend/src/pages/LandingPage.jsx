import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Features data
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "Assistant Juridique IA",
      description: "Obtenez des réponses précises à vos questions juridiques grâce à notre intelligence artificielle spécialement formée sur le droit marocain."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Bibliothèque de Codes Juridiques",
      description: "Consultez facilement les textes complets des codes juridiques marocains, organisés et accessibles en quelques clics."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Références Vérifiées",
      description: "Toutes les réponses sont appuyées par des références aux textes de loi pertinents, garantissant leur fiabilité et leur précision."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Historique des Consultations",
      description: "Retrouvez facilement l'historique de vos conversations et consultations juridiques précédentes à tout moment."
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      quote: "Cette application a changé ma façon de rechercher des informations juridiques. L'intelligence artificielle fournit des réponses précises et bien référencées en quelques secondes.",
      author: "Mohammed A.",
      role: "Avocat à Casablanca"
    },
    {
      quote: "En tant qu'étudiant en droit, JuriDOC est devenu mon outil indispensable pour comprendre rapidement les textes juridiques et vérifier mes interprétations.",
      author: "Fatima L.",
      role: "Étudiante en droit à Rabat"
    },
    {
      quote: "L'interface est intuitive et l'accès aux codes juridiques est bien organisé. Je recommande vivement cet outil à tous les professionnels du droit.",
      author: "Youssef B.",
      role: "Juriste d'entreprise"
    }
  ];
  
  return (
    <div ref={scrollRef} className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-700">
                  <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-purple-800">JuriDOC</span>
            </div>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-700 font-medium">Fonctionnalités</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-purple-700 font-medium">Comment ça marche</a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-700 font-medium">Témoignages</a>
              <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">Se connecter</Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm hover:shadow transition-all"
              >
                S'inscrire
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-purple-700 hover:bg-purple-50"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-purple-100"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a 
                href="#features" 
                className="block py-2 px-4 rounded-lg hover:bg-purple-50 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a 
                href="#how-it-works" 
                className="block py-2 px-4 rounded-lg hover:bg-purple-50 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Comment ça marche
              </a>
              <a 
                href="#testimonials" 
                className="block py-2 px-4 rounded-lg hover:bg-purple-50 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Témoignages
              </a>
              <div className="pt-4 border-t border-purple-100 space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center py-2 px-4 text-purple-600 hover:bg-purple-50 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white pt-16 pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            style={{ opacity, scale, y }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Votre Assistant Juridique <span className="text-purple-600">Intelligent</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Obtenez des réponses juridiques précises et fiables en quelques secondes grâce à notre 
              assistant IA spécialisé dans le droit marocain.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/register" 
                className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-md hover:shadow-lg transition-all font-medium text-lg"
              >
                Commencer gratuitement
              </Link>
              <a 
                href="#how-it-works" 
                className="px-8 py-3 bg-white text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 shadow-sm hover:shadow transition-all font-medium text-lg flex items-center justify-center"
              >
                Comment ça marche
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Preview image */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-100">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent z-10"></div>
              <img 
                src="/images/app-preview.png" 
                alt="JuriDOC Assistant Preview" 
                className="w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/1200x800/f5f3ff/a855f7?text=JuriDOC+Assistant+Preview';
                }}
              />
              
              {/* Floating chat bubble */}
              <div className="absolute bottom-8 right-8 bg-white rounded-xl p-4 shadow-lg border border-purple-100 max-w-xs z-20">
                <div className="flex items-start mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-700">
                    Quelles sont les conditions pour déposer une demande de divorce au Maroc?
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-700">
                    Selon le <span className="text-purple-600 font-medium">Code de la Famille (Moudawana)</span>, vous pouvez déposer une demande de divorce par consentement mutuel ou pour...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Wave decoration */}
          <div className="absolute left-0 right-0 bottom-0 h-16 sm:h-24 bg-wave-pattern bg-repeat-x bg-bottom bg-contain"></div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Fonctionnalités principales</h2>
            <p className="text-lg text-gray-600">
              Découvrez les outils qui rendent JuriDOC indispensable pour toutes vos questions juridiques.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-all card-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Comment ça marche</h2>
            <p className="text-lg text-gray-600">
              Obtenez des réponses juridiques en trois étapes simples.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-md text-center relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="h-40 flex items-center justify-center mb-4">
                <img 
                  src="/images/question.svg"
                  alt="Posez votre question" 
                  className="h-32 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/200x200/f5f3ff/a855f7?text=Question';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Posez votre question</h3>
              <p className="text-gray-600">
                Rédigez votre question juridique en langage naturel, comme si vous parliez à un avocat.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-md text-center relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="h-40 flex items-center justify-center mb-4">
                <img 
                  src="/images/ai-search.svg"
                  alt="IA analyse" 
                  className="h-32 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/200x200/f5f3ff/a855f7?text=IA+Analyse';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre IA analyse</h3>
              <p className="text-gray-600">
                L'IA recherche dans notre base de données juridiques marocains pour trouver les informations pertinentes.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-md text-center relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="h-40 flex items-center justify-center mb-4">
                <img 
                  src="/images/answer.svg"
                  alt="Obtenez une réponse" 
                  className="h-32 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/200x200/f5f3ff/a855f7?text=Réponse';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Obtenez une réponse</h3>
              <p className="text-gray-600">
                Recevez une réponse claire avec des références aux textes de loi pertinents en quelques secondes.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-lg mx-auto mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-purple-100 rounded-xl p-6 border border-purple-200"
            >
              <p className="text-purple-800 font-medium mb-4">
                Prêt à essayer JuriDOC?
              </p>
              <Link 
                to="/register" 
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm hover:shadow transition-all font-medium"
              >
                Créer un compte gratuitement
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 bg-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-lg text-gray-600">
              Découvrez pourquoi des professionnels du droit et des particuliers font confiance à JuriDOC.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-purple-100 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 mb-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mr-3">
                    <span className="text-purple-700 font-medium text-sm">
                      {testimonial.author.split(' ').map(part => part[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="px-6 py-12 sm:px-12 sm:py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Commencez à utiliser JuriDOC dès aujourd'hui
              </h2>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-8">
                Obtenez des réponses juridiques précises, explorez les codes juridiques marocains et 
                simplifiez vos recherches juridiques en quelques clics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-white text-purple-700 rounded-xl hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all font-medium text-lg"
                >
                  Créer un compte gratuit
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-3 bg-transparent text-white border border-white/30 rounded-xl hover:bg-white/10 shadow-lg hover:shadow-xl transition-all font-medium text-lg"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-700">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-purple-800">JuriDOC</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                JuriDOC est votre assistant juridique intelligent spécialisé dans le droit marocain. 
                Nous simplifions l'accès à l'information juridique grâce à notre technologie d'intelligence artificielle.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-600">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Produit</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-gray-600 hover:text-purple-600">Fonctionnalités</a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-600 hover:text-purple-600">Comment ça marche</a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-600 hover:text-purple-600">Témoignages</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">Tarifs</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Ressources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">Centre d'aide</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">Blog juridique</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">Guides</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">API</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} JuriDOC. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add the wave pattern as a hidden div for preloading */}
      <div className="hidden">
        <div className="bg-wave-pattern"></div>
      </div>
      
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-2 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
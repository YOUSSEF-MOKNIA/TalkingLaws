// Import JSON files
import constitutionMarocaine2011 from '../assets/law_codes/constitution_marocaine_2011/articles.json';
import codePenale2018 from '../assets/law_codes/code_penale_2018/articles.json';
import codeTravail2011 from '../assets/law_codes/code_travail_2011/articles.json';
import codeObligationContrats2019 from '../assets/law_codes/code_obligation_contrats_2019/articles.json';
import codeCommerce2019 from '../assets/law_codes/code_commerce_2019/articles.json';
import codeFamille2016 from '../assets/law_codes/code_famille_2016/articles.json';
import loi0908 from '../assets/law_codes/loi_09_08_2009/articles.json';
import loi4320 from '../assets/law_codes/loi_43_20_2020/articles.json';

// Icons for different types of codes
export const CodeIcons = {
  constitution: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l9-4 9 4v12l-9 4-9-4V6z" />
    </svg>
  ),
  penal: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  work: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  contract: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  commerce: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  family: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  privacy: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  finance: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Configuration for all legal codes
export const CODES_CONFIG = {
  constitution_marocaine_2011: {
    id: 'constitution_marocaine_2011',
    title: "Constitution Marocaine",
    shortTitle: "Constitution",
    year: "2011",
    description: "La constitution du Royaume du Maroc promulguée en 2011",
    category: "Droit constitutionnel",
    icon: CodeIcons.constitution,
    data: constitutionMarocaine2011,
    theme: {
      primary: "blue",
      colors: {
        bg: "bg-blue-50",
        text: "text-blue-900",
        accent: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:bg-blue-100",
        gradient: "from-blue-500 to-blue-600"
      }
    }
  },
  code_penale_2018: {
    id: 'code_penale_2018',
    title: "Code Pénal",
    shortTitle: "Pénal",
    year: "2018",
    description: "Code pénal marocain, dispositions générales et spéciales",
    category: "Droit pénal",
    icon: CodeIcons.penal,
    data: codePenale2018,
    theme: {
      primary: "red",
      colors: {
        bg: "bg-red-50",
        text: "text-red-900",
        accent: "text-red-600",
        border: "border-red-200",
        hover: "hover:bg-red-100",
        gradient: "from-red-500 to-red-600"
      }
    }
  },
  code_travail_2011: {
    id: 'code_travail_2011',
    title: "Code du Travail",
    shortTitle: "Travail",
    year: "2011",
    description: "Législation du travail, relations professionnelles et sécurité sociale",
    category: "Droit social",
    icon: CodeIcons.work,
    data: codeTravail2011,
    theme: {
      primary: "green",
      colors: {
        bg: "bg-green-50",
        text: "text-green-900",
        accent: "text-green-600",
        border: "border-green-200",
        hover: "hover:bg-green-100",
        gradient: "from-green-500 to-green-600"
      }
    }
  },
  code_obligation_contrats_2019: {
    id: 'code_obligation_contrats_2019',
    title: "Code des Obligations et Contrats",
    shortTitle: "Obligations",
    year: "2019",
    description: "Dahir formant code des obligations et des contrats",
    category: "Droit civil",
    icon: CodeIcons.contract,
    data: codeObligationContrats2019,
    theme: {
      primary: "amber",
      colors: {
        bg: "bg-amber-50",
        text: "text-amber-900",
        accent: "text-amber-600",
        border: "border-amber-200",
        hover: "hover:bg-amber-100",
        gradient: "from-amber-500 to-amber-600"
      }
    }
  },
  code_commerce_2019: {
    id: 'code_commerce_2019',
    title: "Code de Commerce",
    shortTitle: "Commerce",
    year: "2019",
    description: "Loi relative au code de commerce, activités commerciales",
    category: "Droit commercial",
    icon: CodeIcons.commerce,
    data: codeCommerce2019,
    theme: {
      primary: "purple",
      colors: {
        bg: "bg-purple-50",
        text: "text-purple-900",
        accent: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:bg-purple-100",
        gradient: "from-purple-500 to-purple-600"
      }
    }
  },
  code_famille_2016: {
    id: 'code_famille_2016',
    title: "Code de la Famille",
    shortTitle: "Famille",
    year: "2016",
    description: "Moudawana - Code du statut personnel et des relations familiales",
    category: "Droit de la famille",
    icon: CodeIcons.family,
    data: codeFamille2016,
    theme: {
      primary: "teal",
      colors: {
        bg: "bg-teal-50",
        text: "text-teal-900",
        accent: "text-teal-600",
        border: "border-teal-200",
        hover: "hover:bg-teal-100",
        gradient: "from-teal-500 to-teal-600"
      }
    }
  },
  loi0908: {
    id: 'loi0908',
    title: "Loi 09-08",
    shortTitle: "Loi 09-08",
    year: "2009",
    description: "Protection des personnes physiques à l'égard du traitement des données personnelles",
    category: "Droit numérique",
    icon: CodeIcons.privacy,
    data: loi0908,
    theme: {
      primary: "rose",
      colors: {
        bg: "bg-rose-50",
        text: "text-rose-900",
        accent: "text-rose-600",
        border: "border-rose-200",
        hover: "hover:bg-rose-100",
        gradient: "from-rose-500 to-rose-600"
      }
    }
  },
  loi4320: {
    id: 'loi4320',
    title: "Loi 43-20",
    shortTitle: "Loi 43-20",
    year: "2020",
    description: "Lutte contre le blanchiment d'argent et le financement du terrorisme",
    category: "Droit financier",
    icon: CodeIcons.finance,
    data: loi4320,
    theme: {
      primary: "indigo",
      colors: {
        bg: "bg-indigo-50",
        text: "text-indigo-900",
        accent: "text-indigo-600",
        border: "border-indigo-200",
        hover: "hover:bg-indigo-100",
        gradient: "from-indigo-500 to-indigo-600"
      }
    }
  }
};

// Helper function to get all codes
export const getAllCodes = () => Object.values(CODES_CONFIG);

// Helper function to get code by ID
export const getCodeById = (id) => CODES_CONFIG[id];

// Helper function to get codes by category
export const getCodesByCategory = (category) => 
  Object.values(CODES_CONFIG).filter(code => code.category === category);

// Get all categories
export const getAllCategories = () => 
  [...new Set(Object.values(CODES_CONFIG).map(code => code.category))];
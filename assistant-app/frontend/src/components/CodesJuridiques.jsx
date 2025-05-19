import React from "react";

export default function BrowsePage() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-50/40 to-purple-50/40">
      <div className="border-b border-purple-100 bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Codes Juridiques</h1>
          <p className="text-gray-600 mt-1">Explorez les textes de loi marocains par domaine</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Fonctionnalité à venir</h2>
            <p className="text-gray-600 mb-6">La navigation des codes juridiques marocains sera bientôt disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
}
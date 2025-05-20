import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatMessageList({ messages, currentStreamingMessage, isLoading }) {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStreamingMessage]);
  
  const formatMessageContent = (content) => {
    if (!content) return [];
    
    // Split content by new lines
    const lines = content.split('\n');
    const formattedContent = [];
    let listItems = [];
    let listType = null;
    
    lines.forEach((line, index) => {
      // Empty line
      if (!line.trim()) {
        if (listItems.length > 0) {
          // Add the accumulated list
          formattedContent.push(
            <div key={`list-${index}`} className="my-2">
              {listType === 'bullet' ? (
                <ul className="list-disc pl-6 space-y-1">{listItems}</ul>
              ) : (
                <ol className="list-decimal pl-6 space-y-1">{listItems}</ol>
              )}
            </div>
          );
          listItems = [];
          listType = null;
        }
        formattedContent.push(<div key={`br-${index}`} className="h-4"></div>);
        return;
      }
      
      // Bullet list items
      if (line.trim().match(/^[•\-*]\s/)) {
        const itemContent = line.trim().replace(/^[•\-*]\s/, '');
        if (listType !== 'bullet') {
          // If we were tracking a different list type, push it first
          if (listItems.length > 0) {
            formattedContent.push(
              <div key={`list-${index}`} className="my-2">
                {listType === 'number' ? (
                  <ol className="list-decimal pl-6 space-y-1">{listItems}</ol>
                ) : (
                  <ul className="list-disc pl-6 space-y-1">{listItems}</ul>
                )}
              </div>
            );
            listItems = [];
          }
          listType = 'bullet';
        }
        listItems.push(<li key={`item-${index}`}>{itemContent}</li>);
      } 
      // Numbered list items
      else if (line.trim().match(/^\d+\.\s/)) {
        const itemContent = line.trim().replace(/^\d+\.\s/, '');
        if (listType !== 'number') {
          // If we were tracking a different list type, push it first
          if (listItems.length > 0) {
            formattedContent.push(
              <div key={`list-${index}`} className="my-2">
                {listType === 'bullet' ? (
                  <ul className="list-disc pl-6 space-y-1">{listItems}</ul>
                ) : (
                  <ol className="list-decimal pl-6 space-y-1">{listItems}</ol>
                )}
              </div>
            );
            listItems = [];
          }
          listType = 'number';
        }
        listItems.push(<li key={`item-${index}`}>{itemContent}</li>);
      } 
      // Regular paragraph
      else {
        // If we were tracking a list, push it first
        if (listItems.length > 0) {
          formattedContent.push(
            <div key={`list-${index}`} className="my-2">
              {listType === 'bullet' ? (
                <ul className="list-disc pl-6 space-y-1">{listItems}</ul>
              ) : (
                <ol className="list-decimal pl-6 space-y-1">{listItems}</ol>
              )}
            </div>
          );
          listItems = [];
          listType = null;
        }
        formattedContent.push(<p key={`p-${index}`} className="my-2">{line}</p>);
      }
    });
    
    // Add any remaining list
    if (listItems.length > 0) {
      formattedContent.push(
        <div key="list-end" className="my-2">
          {listType === 'bullet' ? (
            <ul className="list-disc pl-6 space-y-1">{listItems}</ul>
          ) : (
            <ol className="list-decimal pl-6 space-y-1">{listItems}</ol>
          )}
        </div>
      );
    }
    
    return formattedContent;
  };

  // If no messages and not loading, show empty state
  if (messages.length === 0 && !isLoading && !currentStreamingMessage) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Comment puis-je vous aider aujourd'hui?</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">
              Je suis votre assistant juridique marocain. Posez-moi n'importe quelle question concernant la législation.
            </p>
          </div>
          
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              "Quelles sont les conditions du divorce au Maroc?",
              "Comment créer une entreprise au Maroc?",
              "Quels sont mes droits en tant que locataire?"
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -2, backgroundColor: "rgba(233, 213, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-white border border-purple-100 rounded-xl shadow-sm text-left hover:shadow-md transition-all duration-200"
              >
                <p className="text-sm font-medium text-gray-800">{suggestion}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-6 flex items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0 mr-3 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
                  <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <div 
              className={`rounded-2xl p-5 max-w-[85%] shadow-sm ${
                message.role === "user" 
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white" 
                  : "bg-white border border-purple-100"
              }`}
            >
              {message.role === "user" ? (
                <p>{message.content}</p>
              ) : (
                <div className="text-gray-800">{formatMessageContent(message.content)}</div>
              )}
            </div>
            
            {message.role === "user" && (
              <div className="h-10 w-10 rounded-xl bg-gray-100 flex-shrink-0 ml-3 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
        
        {currentStreamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start justify-start"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0 mr-3 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
                <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="rounded-2xl p-5 max-w-[85%] shadow-sm bg-white border border-purple-100">
              <div className="text-gray-800">
                {formatMessageContent(currentStreamingMessage)}
                <span className="inline-flex ml-1">
                  <motion.span 
                    className="h-4 w-1 bg-purple-400 rounded-full" 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        {isLoading && !currentStreamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start justify-start"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0 mr-3 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
                <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="rounded-2xl p-5 h-14 flex items-center max-w-[85%] shadow-sm bg-white border border-purple-100">
              <div className="flex space-x-2">
                <motion.div
                  animate={{ scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-2.5 w-2.5 bg-purple-400 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="h-2.5 w-2.5 bg-purple-400 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="h-2.5 w-2.5 bg-purple-400 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} className="h-px" />
    </div>
  );
}
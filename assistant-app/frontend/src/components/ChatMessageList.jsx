import React from "react";
import { motion } from "framer-motion";

export default function ChatMessageList({ messages, currentStreamingMessage, isLoading }) {
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

  return (
    <div className="max-w-3xl mx-auto">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mb-6 ${message.role === "user" ? "flex justify-end" : "flex"}`}
        >
          {message.role === "assistant" && (
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex-shrink-0 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 3L4 9v12h16V9l-8-6z" />
                <path d="M12 16h-2v4h2v-4zM14 16v4h2v-4h-2z" />
              </svg>
            </div>
          )}
          
          <div 
            className={`rounded-2xl px-5 py-3 max-w-[85%] shadow-sm ${
              message.role === "user" 
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" 
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
            <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 ml-3 flex items-center justify-center">
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
          className="mb-6 flex"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex-shrink-0 mr-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 3L4 9v12h16V9l-8-6z" />
              <path d="M12 16h-2v4h2v-4zM14 16v4h2v-4h-2z" />
            </svg>
          </div>
          
          <div className="rounded-2xl px-5 py-3 max-w-[85%] shadow-sm bg-white border border-purple-100">
            <div className="text-gray-800">
              {formatMessageContent(currentStreamingMessage)}
              <span className="inline-block w-2 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse ml-1"></span>
            </div>
          </div>
        </motion.div>
      )}
      
      {isLoading && !currentStreamingMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex-shrink-0 mr-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 3L4 9v12h16V9l-8-6z" />
              <path d="M12 16h-2v4h2v-4zM14 16v4h2v-4h-2z" />
            </svg>
          </div>
          
          <div className="rounded-2xl px-5 py-4 max-w-[85%] shadow-sm bg-white border border-purple-100">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
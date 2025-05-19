import React, { useState, useRef, useEffect } from "react";
import ChatMessageList from "../components/ChatMessageList";
import ChatInput from "../components/ChatInput";
import ArticleReferences from "../components/ArticleReferences";
import WelcomeScreen from "../components/WelcomeScreen";
import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStreamingMessage]);

  const streamResponse = async (question) => {
    try {
      const token = getAuthToken();
      
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question, stream: true }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fetchedArticles = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            switch (data.type) {
              case 'articles':
                fetchedArticles = data.articles;
                setArticles(data.articles);
                break;
              case 'token':
                setCurrentStreamingMessage(prev => prev + data.token);
                break;
              case 'complete':
                setCurrentStreamingMessage("");
                setMessages(prev => [
                  ...prev,
                  { role: "assistant", content: data.response }
                ]);
                break;
            }
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Désolé, une erreur s'est produite lors du traitement de votre demande." }
      ]);
      setCurrentStreamingMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: currentQuestion }]);
    const questionCopy = currentQuestion;
    setCurrentQuestion("");
    setIsLoading(true);
    setCurrentStreamingMessage("");

    await streamResponse(questionCopy);
  };

  const startNewChat = () => {
    setMessages([]);
    setArticles([]);
    setCurrentStreamingMessage("");
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <div className="flex-grow flex flex-col min-w-0 h-full">
        <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-indigo-50/40 to-purple-50/40">
          {messages.length === 0 ? (
            <WelcomeScreen userName={user?.full_name} />
          ) : (
            <ChatMessageList 
              messages={messages} 
              currentStreamingMessage={currentStreamingMessage} 
              isLoading={isLoading} 
            />
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-purple-100 bg-white">
          <ChatInput 
            value={currentQuestion}
            onChange={setCurrentQuestion}
            onSend={handleSendMessage}
            isLoading={isLoading}
            onNewChat={startNewChat}
          />
        </div>
      </div>
      <div className="hidden md:block w-80 lg:w-96 border-l border-purple-100 h-full overflow-hidden flex-shrink-0 bg-white">
        <ArticleReferences articles={articles} />
      </div>
    </div>
  );
}
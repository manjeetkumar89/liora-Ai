import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../theme';

const formatMessage = (text) => {
  // Simple markdown-like formatting
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  const bulletRegex = /^\s*[-*]\s(.+)$/gm;
  const numberRegex = /^\s*(\d+)\.\s(.+)$/gm;

  let formattedText = text
    .replace(codeBlockRegex, (match, code) => `
      <pre class="bg-black/20 p-4 rounded-lg my-2 overflow-x-auto">
        <code>${code.trim()}</code>
      </pre>
    `)
    .replace(inlineCodeRegex, '<code class="bg-black/20 px-1.5 py-0.5 rounded">$1</code>')
    .replace(bulletRegex, '<div class="flex gap-2">•<span>$1</span></div>')
    .replace(numberRegex, '<div class="flex gap-2"><span>$1.</span><span>$2</span></div>');

  return { __html: formattedText };
};

export const Home = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant.');
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: 'React Development Help', timestamp: 'Just now', active: true },
    { id: 2, title: 'AI Assistance', timestamp: '2 hours ago', active: false },
    { id: 3, title: 'Project Planning', timestamp: '1 day ago', active: false },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close sidebar on mobile when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const simulateTyping = async (text) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
    return text;
  };

  const generateAIResponse = async (userMessage) => {
    const responses = {
      'help me with react': 'React is a JavaScript library for building user interfaces. What specific aspect would you like to learn about? I can help with:\n\n1. Components and Props\n2. State Management\n3. Hooks\n4. Routing\n5. Performance Optimization',
      'write a blog post': "I'll help you write a blog post. First, let's determine:\n\n1. The main topic\n2. Target audience\n3. Key points to cover\n4. Desired length\n\nWhat topic would you like to write about?",
      'explain async/await': "Async/await is a way to handle asynchronous operations in JavaScript. Here's a simple explanation:\n\n```javascript\nasync function fetchData() {\n  try {\n    const response = await fetch('api/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n```\n\nWould you like me to explain more about how it works?",
      'create a color scheme': "I'll help you create a color scheme. Let's start with these modern combinations:\n\n1. 🎨 Primary: #19c37d\n2. 🌟 Accent: #4f46e5\n3. 🌑 Dark: #343541\n4. ⭐ Light: #ececf1\n\nWould you like to explore more color combinations or adjust these?"
    };

    const defaultResponse = "I understand you're asking about '" + userMessage + "'. Could you provide more details about what specific information or help you're looking for?";

    const matchingResponse = Object.entries(responses).find(([key]) =>
      userMessage.toLowerCase().includes(key.toLowerCase())
    );

    return matchingResponse ? matchingResponse[1] : defaultResponse;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newUserMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
      };

      setMessages(prev => [...prev, newUserMessage]);
      setInputMessage('');

      // Generate and add AI response
      const aiResponse = await generateAIResponse(inputMessage);
      const newAiMessage = {
        id: messages.length + 2,
        text: await simulateTyping(aiResponse),
        sender: 'ai',
      };

      setMessages(prev => [...prev, newAiMessage]);

      // Update chat list with new chat if it's the first message
      if (messages.length === 0) {
        const newChat = {
          id: chats.length + 1,
          title: inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : ''),
          active: true
        };
        setChats(prev => [newChat, ...prev.map(chat => ({ ...chat, active: false }))]);
      }
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    // const newChat = {
    //   id: Date.now(), // Use timestamp as ID
    //   title: 'New Chat',
    //   timestamp: 'Just now',
    //   active: true
    // };
    // setChats(prev => [newChat, ...prev.map(chat => ({ ...chat, active: false }))]);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    setChats(prev => prev.filter(chat => chat.id !== chatId));

    // If we're deleting the active chat, clear messages
    if (chats.find(chat => chat.id === chatId)?.active) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: currentTheme.background }}>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-30 w-[280px] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-in-out md:translate-x-0 border-r shadow-xl`}
        style={{
          background: currentTheme.gradients.sidebar,
          borderColor: currentTheme.border
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.1)' }}>
            <div className="flex items-center justify-between mb-3 md:hidden">
              <h2 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Chats</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                style={{ color: currentTheme.text }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="flex items-center justify-center w-full px-3 py-3 rounded-md transition-all duration-200 border hover:opacity-90 group"
              style={{
                borderColor: currentTheme.border,
                background: 'transparent',
                color: currentTheme.text
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-grow overflow-y-auto px-2 py-2 space-y-1">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 group ${chat.active ? 'bg-[#343541]' : 'hover:bg-[#2A2B32]'
                  } relative`}
                style={{
                  color: currentTheme.text
                }}
                onClick={() => {
                  setChats(prev => prev.map(c => ({
                    ...c,
                    active: c.id === chat.id
                  })));
                  // Here you would typically load the chat messages
                }}
              >
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="flex-grow min-w-0"> {/* Add min-w-0 to allow truncation */}
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className={`text-xs ${chat.active ? 'text-white/70' : 'opacity-50'}`}>
                    {chat.timestamp}
                  </div>
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/10 p-1 rounded-lg transition-all duration-200 absolute right-2"
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  title="Delete chat"
                  style={{ color: currentTheme.text }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Profile Section */}
          <div
            className="p-4 border-t cursor-pointer hover:bg-opacity-80 transition-colors"
            style={{ borderColor: currentTheme.border }}
            onClick={() => setIsProfileOpen(true)}
          >
            <div
              className="flex items-center p-3 rounded-xl hover:shadow-md transition-all duration-200"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium mr-3">
                JD
              </div>
              <div className="flex-grow">
                <div className="font-medium">John Doe</div>
                <div className="text-sm opacity-50">john@example.com</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div
          className="flex items-center px-6 py-4 border-b shadow-sm"
          style={{
            background: currentTheme.cardBg,
            borderColor: currentTheme.border,
            color: currentTheme.text
          }}
        >
          <button
            className="md:hidden mr-4 hover:bg-white/10 rounded-lg p-1 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Liora AI Chat</h1>
              <span className="ml-3 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: currentTheme.primary + '20',
                  color: currentTheme.primary
                }}>
                Active
              </span>
            </div>
            <button
              onClick={() => setIsSystemPromptOpen(true)}
              className="flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 text-sm"
              style={{
                background: currentTheme.inputBg,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              System Prompt
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="flex-grow overflow-y-auto"
          style={{ background: currentTheme.background }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
              {/* <div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-medium mb-6"
              >
                AI
              </div> */}
              <h2
                className="text-2xl md:text-3xl font-bold mb-3 text-center"
                style={{ color: currentTheme.text }}
              >
                Welcome to Liora AI
              </h2>
              <p
                className="text-center max-w-md mb-8"
                style={{ color: currentTheme.secondary }}
              >
                Start a conversation with Liora AI. Ask anything from coding questions to creative writing.
              </p>
              <div className="w-full max-w-2xl">
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { text: "Help me with React", gradient: "blue" },
                    { text: "Write a blog post", gradient: "purple" },
                    { text: "Explain async/await", gradient: "pink" },
                    { text: "Create a color scheme", gradient: "green" }
                  ].map((suggestion) => (
                    <button
                      key={suggestion.text}
                      onClick={() => setInputMessage(suggestion.text)}
                      className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm backdrop-blur-sm animate-fadeIn"
                      style={{
                        background: currentTheme.gradients[suggestion.gradient],
                        color: '#ffffff',
                      }}
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto py-6 px-4 md:px-8 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-messageIn`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animation: 'messageIn 0.5s ease-out forwards'
                  }}
                >
                  {message.sender === 'ai' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0 shadow-lg animate-pop"
                      style={{ background: currentTheme.gradients.purple }}
                    >
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-3 group rounded-2xl ${message.sender === 'user' ? 'ml-12' : ''
                      } transition-all duration-300`}
                    style={{
                      background: message.sender === 'user' ? currentTheme.cardBg : currentTheme.cardBg,
                      color: currentTheme.text,
                    }}
                  >
                    <div
                      className="whitespace-pre-wrap prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={formatMessage(message.text)}
                    />
                    <div className="mt-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {message.sender === 'ai' && (
                        <>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.text);
                              // You could add a toast notification here
                              alert('Message copied to clipboard!');
                            }}
                            className="p-1 rounded hover:bg-black/10 transition-colors"
                            title="Copy to clipboard"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setInputMessage(messages[messages.findIndex(m => m.id === message.id) - 1]?.text || '');
                            }}
                            className="p-1 rounded hover:bg-black/10 transition-colors"
                            title="Regenerate response"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ml-3 flex-shrink-0 shadow-lg animate-pop"
                      style={{ background: currentTheme.gradients.blue }}
                    >
                      JD
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fadeIn">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3 flex-shrink-0 shadow-lg"
                    style={{ background: currentTheme.gradients.purple }}
                  >
                    AI
                  </div>
                  <div
                    className="max-w-[85%] md:max-w-[75%] p-4 rounded-2xl rounded-tl-sm backdrop-blur-sm"
                    style={{
                      background: 'rgba(24, 24, 27, 0.5)',
                      border: `1px solid ${currentTheme.border}`,
                    }}
                  >
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <style>
          {`
            @keyframes messageIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes pop {
              0% {
                transform: scale(0.8);
                opacity: 0;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            .animate-messageIn {
              animation: messageIn 0.5s ease-out forwards;
            }
            .animate-pop {
              animation: pop 0.3s ease-out forwards;
            }
            .animate-fadeIn {
              animation: fadeIn 0.5s ease-out forwards;
            }
          `}
        </style>
        {/* Input Area */}
        <div
          className={`fixed bottom-0 left-0 right-0 md:static p-4 md:p-8 transition-all duration-500 ${messages.length === 0 ? 'transform translate-y-0' : ''
            }`}
          style={{
            background: 'linear-gradient(180deg, rgba(53,55,64,0), #353740 25%, #353740)',
            borderTop: `1px solid ${currentTheme.border}`,
          }}
        >
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="flex space-x-4 items-end justify-center">
              <div className="flex-grow relative group">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none pr-12 font-light"
                  style={{
                    background: currentTheme.inputBg,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.border}`,
                    boxShadow: 'none',
                  }}
                  placeholder="Type your message here..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                {/* <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                  style={{ 
                    background: currentTheme.primaryLight,
                    border: `1px solid ${currentTheme.primarySolid}`,
                  }}
                /> */}
              </div>
              <button
                type="submit"
                className="absolute right-5 bottom-3 p-2 rounded-lg transition-all duration-200 hover:bg-[#202123] flex items-center justify-center"
                style={{
                  background: inputMessage.trim() ? currentTheme.primary : 'transparent',
                  color: inputMessage.trim() ? '#fff' : currentTheme.text,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className=" w-5 aspect-[1] transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* System Prompt Modal */}
      {isSystemPromptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsSystemPromptOpen(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl m-4 shadow-xl"
            style={{ background: currentTheme.cardBg }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold"
                style={{ color: currentTheme.text }}
              >
                System Prompt
              </h2>
              <button
                onClick={() => setIsSystemPromptOpen(false)}
                className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
                style={{ background: currentTheme.inputBg }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ color: currentTheme.text }}
                >
                  Select a preset or create your own
                </label>
                <select
                  className="w-full px-4 py-2 rounded-xl outline-none transition-colors mb-4"
                  style={{
                    background: currentTheme.inputBg,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.border}`
                  }}
                  value={systemPrompt}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setSystemPrompt('');
                    } else {
                      setSystemPrompt(e.target.value);
                    }
                  }}
                >
                  <option value="You are a helpful AI assistant.">General Assistant</option>
                  <option value="You are an expert software developer who helps with coding questions.">Code Expert</option>
                  <option value="You are a creative writing assistant who helps with content creation.">Writing Assistant</option>
                  <option value="You are a data analysis expert who helps with interpreting data.">Data Analyst</option>
                  <option value="custom">Custom Prompt...</option>
                </select>

                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors"
                  style={{
                    background: currentTheme.inputBg,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.border}`
                  }}
                  placeholder="Enter your custom system prompt..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsSystemPromptOpen(false)}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    background: currentTheme.inputBg,
                    color: currentTheme.text
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would typically update the AI context
                    setIsSystemPromptOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: currentTheme.primary,
                    color: '#ffffff'
                  }}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="w-full max-w-md p-8 rounded-2xl m-4 shadow-xl transform transition-all duration-200"
            style={{ background: currentTheme.cardBg }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: currentTheme.text }}
              >
                Profile Settings
              </h2>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-2 rounded-full hover:bg-opacity-80 transition-colors"
                style={{ background: currentTheme.inputBg }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-medium">
                  JD
                </div>
                <button
                  className="text-sm font-medium hover:underline"
                  style={{ color: currentTheme.primary }}
                >
                  Change Photo
                </button>
              </div>

              {/* Profile fields */}
              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ color: currentTheme.text }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-3 rounded-xl outline-none transition-colors"
                  style={{
                    background: currentTheme.inputBg,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.border}`
                  }}
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ color: currentTheme.text }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-3 rounded-xl outline-none transition-colors"
                  style={{
                    background: currentTheme.inputBg,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.border}`
                  }}
                  defaultValue="john@example.com"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    background: currentTheme.inputBg,
                    color: currentTheme.text
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: currentTheme.primary,
                    color: '#ffffff'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
